import {
  emailValidator,
  nameValidator,
  passwordValidator,
  userNameValidator,
} from "@/validators/auth.validator";
import { api } from "@/lib/api/apiHandler";
import { apiUrls } from "../api/apiUtils";

type AuthFormStateType = {
  success?: boolean;
  title: string;
  message: string;
  inputs?: Record<string, FormDataEntryValue>;
  errors?: {
    email?: string | null;
    password?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  };
  data?: any;
};

export const registerAction = async (
  prevState: AuthFormStateType,
  formData: FormData,
) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  logger.debug("debug from registerAction email:", email);
  logger.debug("debug from registerAction password:", password);
  logger.debug("debug from registerAction firstName:", firstName);
  logger.debug("debug from registerAction lastName:", lastName);

  const errors: AuthFormStateType["errors"] = {};

  const { validatedEmail, message: emailError } = emailValidator(
    email as string,
  );
  errors.email = emailError ?? null;

  logger.debug("debug from registerAction validatedEmail:", validatedEmail);
  logger.debug("debug from registerAction emailError:", emailError);

  const { validatedPassword, message: passwordError } = passwordValidator(
    password as string,
  );
  errors.password = passwordError ?? null;

  logger.debug(
    "debug from registerAction validatedPassword:",
    validatedPassword,
  );
  logger.debug("debug from registerAction passwordError:", passwordError);

  const { validatedName: validatedFirstName, message: firstNameError } =
    nameValidator(firstName, "firstName");
  errors.firstName = firstNameError ?? null;

  logger.debug(
    "debug from registerAction validatedFirstName:",
    validatedFirstName,
  );
  logger.debug("debug from registerAction firstNameError:", firstNameError);

  const { validatedName: validatedLastName, message: lastNameError } =
    nameValidator(lastName, "lastName");
  errors.lastName = lastNameError ?? null;

  logger.debug(
    "debug from registerAction validatedLastName:",
    validatedLastName,
  );
  logger.debug("debug from registerAction lastNameError:", lastNameError);
  logger.debug("debug from registerAction errors:", errors);
  logger.debug(
    "debug from registerAction Object.values(errors):",
    Object.values(errors),
  );
  logger.debug(
    "debug from registerAction Object.values(errors).filter((error) => error !== null):",
    Object.values(errors).filter((error) => error !== null),
  );
  logger.debug(
    "debug from registerAction Object.values(errors).filter((error) => error !== null).length:",
    Object.values(errors).filter((error) => error !== null).length,
  );

  if (Object.values(errors).filter((error) => error !== null).length > 0) {
    return {
      message: "REGISTRATION FAILED",
      errors,
      success: false,
      inputs: Object.fromEntries(formData),
    };
  }
  logger.debug("debug from registerAction before register request try block");

  try {
    logger.debug("debug from registerAction before register request");
    const response = await api.post(apiUrls.auth.register, {
      email: validatedEmail,
      password: validatedPassword,
      firstName: validatedFirstName,
      lastName: validatedLastName,
    });

    logger.debug("debug from registerAction response:", response);

    return {
      success: response.success ?? true,
      title: response.status ?? "REGISTRATION SUCCESS",
      message:
        response.message ??
        "User registered successfully, please login to continue!",
      data: response.data ?? null,
    };
  } catch (error) {
    // if (response.success === false) {
    //   return {
    //     success: response?.success ?? false,
    //     title: response?.code ?? "REGISTRATION FAILED",
    //     message:
    //       response?.message ?? "Unable to register user, please try again!",
    //     details: response.details ?? null,
    //   };
    // }

    logger.debug("debug from registerAction error:", error);

    return {
      success: false,
      title: "REGISTRATION FAILED",
      message: "Unable to register user, please try again!",
      inputs: Object.fromEntries(formData),
    };
  }
};
