import { isValidObjectId } from "mongoose";
import Address from "../../models/auth/address.model.js";
import { MAX_ADDRESSES } from "../../constants/common.constants.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { asyncHandler } from "../../utils/common.utils.js";
import AppError from "../../errors/app.error.js";
import { httpStatusConfig } from "../../config/http.config.js";
import {
  validateCreateAddress,
  validateUpdateAddress,
} from "../../validators/address.validator.js";

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.data.userId })
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();

  successResponseHandler(req, res, {
    status: "FETCH ADDRESS SUCCESS",
    message: "Addresses fetched successfully!",
    data: { addresses, count: addresses.length },
  });
});

export const getAddress = asyncHandler(async (req, res) => {
  const isAddressIdValid = isValidObjectId(req.data.params.addressId);

  if (!isAddressIdValid) {
    throw AppError.unprocessable({
      message: "Please provide a valid address ID!",
      code: "ADDRESS ID VALIDATION FAILED",
      details: { addressId: req.data.params.addressId },
    });
  }

  const validatedAddressId = req.data.params.addressId;

  const address = await Address.findOne({
    _id: validatedAddressId,
    user: req.data.userId,
  }).lean();

  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: req.data.params.addressId },
    });
  }

  successResponseHandler(req, res, {
    status: "FETCH ADDRESS SUCCESS",
    message: "Address fetched successfully!",
    data: { address },
  });
});

export const createAddress = asyncHandler(async (req, res) => {
  const count = await Address.countDocuments({ user: req.data.userId });
  if (count >= MAX_ADDRESSES) {
    throw new AppError({
      message:
        "You have maximum number of addresses saved, please remove some to continue.",
      code: "ADDRESS CREATE FAILED",
      statusCode: httpStatusConfig.notAcceptable.statusCode,
    });
  }

  const { validatedAddressProperties, errors } = validateCreateAddress(
    req.data.body,
  );

  if (errors && Object.values(errors).length) {
    throw AppError.unprocessable({
      message: "Failed to create new address!",
      code: "ADDRESS CREATE FAILED",
      details: { errors },
    });
  }

  if (validatedAddressProperties.isDefault) {
    await Address.updateMany(
      { user: req.data.userId },
      { $set: { isDefault: false } },
    );
  }

  const shouldBeDefault = validatedAddressProperties.isDefault || count === 0;

  const address = await Address.create({
    user: req.data.userId,
    type: validatedAddressProperties.type,
    street: validatedAddressProperties.street,
    city: validatedAddressProperties.city,
    state: validatedAddressProperties.state,
    country: validatedAddressProperties.country,
    pinCode: validatedAddressProperties.pinCode,
    isDefault: shouldBeDefault,
  });

  successResponseHandler(req, res, {
    status: "ADDRESS CREATE SUCCESS",
    statusCode: httpStatusConfig.created.statusCode,
    message: "Address created successfully!",
    data: { address },
  });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const isAddressIdValid = isValidObjectId(req.data.params.addressId);

  if (!isAddressIdValid) {
    throw AppError.unprocessable({
      message: "Please provide a valid address ID!",
      code: "ADDRESS ID VALIDATION FAILED",
      details: { addressId: req.data.params.addressId },
    });
  }

  const validatedAddressId = req.data.params.addressId;

  const address = await Address.findOne({
    _id: validatedAddressId,
    user: req.data.userId,
  });

  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: validatedAddressId },
    });
  }

  const { validatedAddressProperties, errors } = validateUpdateAddress(
    req.data.body,
  );

  if (errors && Object.values(errors).length) {
    throw AppError.unprocessable({
      message: "Failed to update address!",
      code: "ADDRESS UPDATE FAILED",
      details: { errors },
    });
  }

  if (validatedAddressProperties.isDefault) {
    await Address.updateMany(
      { user: req.data.userId },
      { $set: { isDefault: false } },
    );
  }

  const addressPropertiesToUpdate = Object.fromEntries(
    Object.entries(validatedAddressProperties).filter(
      ([key, value]) => value !== address[key],
    ),
  );

  if (!Object.values(addressPropertiesToUpdate).length) {
    throw AppError.unprocessable({
      message: "No new address properties to update!",
      code: "ADDRESS UPDATE FAILED",
    });
  }

  const updated = await Address.findByIdAndUpdate(
    address._id,
    {
      $set: {
        type: validatedAddressProperties.type,
        street: validatedAddressProperties.street,
        city: validatedAddressProperties.city,
        state: validatedAddressProperties.state,
        country: validatedAddressProperties.country,
        pinCode: validatedAddressProperties.pinCode,
        isDefault: validatedAddressProperties.isDefault,
      },
    },
    { returnDocument: "after", runValidators: true },
  );

  successResponseHandler(req, res, {
    status: "UPDATE ADDRESS SUCCESS",
    message: "Address updated successfully!",
    data: { address: updated },
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const isAddressIdValid = isValidObjectId(req.data.params.addressId);

  if (!isAddressIdValid) {
    throw AppError.unprocessable({
      message: "Please provide a valid address ID!",
      code: "ADDRESS ID VALIDATION FAILED",
      details: { addressId: req.data.params.addressId },
    });
  }

  const validatedAddressId = req.data.params.addressId;

  if (!validatedAddressId) {
    throw AppError.unprocessable({
      message: "Please provide a valid address ID!",
      code: "ADDRESS ID VALIDATION FAILED",
      details: { addressId: req.data.params.addressId },
    });
  }

  const address = await Address.findOneAndDelete({
    _id: validatedAddressId,
    user: req.data.userId,
  });

  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: validatedAddressId },
    });
  }

  if (address.isDefault) {
    const next = await Address.findOne({ user: req.data.userId }).sort({
      createdAt: -1,
    });
    if (next) await next.updateOne({ $set: { isDefault: true } });
  }

  successResponseHandler(req, res, {
    status: "ADDRESS DELETE SUCCESS",
    message: "Address deleted successfully!",
  });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const isAddressIdValid = isValidObjectId(req.data.params.addressId);

  if (!isAddressIdValid) {
    throw AppError.unprocessable({
      message: "Please provide a valid address ID!",
      code: "ADDRESS ID VALIDATION FAILED",
      details: { addressId: req.data.params.addressId },
    });
  }

  const validatedAddressId = req.data.params.addressId;

  const address = await Address.findOne({
    _id: validatedAddressId,
    user: req.data.userId,
  });

  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: validatedAddressId },
    });
  }

  await Address.updateMany(
    { user: req.data.userId },
    { $set: { isDefault: false } },
  );
  await address.updateOne({ $set: { isDefault: true } });

  successResponseHandler(req, res, {
    status: "UPDATE ADDRESS SUCCESS",
    message: "Default address updated successfully!",
  });
});
