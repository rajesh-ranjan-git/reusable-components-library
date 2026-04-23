"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { LuPlus, LuX, LuCode } from "react-icons/lu";
import ModalPortal from "@/components/forms/modalPortal";
import {
  FormField,
  FormInput,
  FormSelect,
  FormButton,
  FormDivider,
} from "@/components/forms/formPrimitives";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/api/apiHandler";
import { useToast } from "@/hooks/toast";
import { stringPropertiesValidator } from "@/validators/common.validator";
import { propertyConstraints } from "@/config/common.config";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import Form from "next/form";
import { updateSkills } from "@/lib/actions/profileActions";
import { toTitleCase } from "@/utils/common.utils";

type Skill = {
  name: string;
  level: string;
  icon?: string;
};

type SkillsFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Skill[];
  onSave: (skills: Skill[]) => void;
};

type FieldErrors = {
  skills?: string | null;
};

type ProfileFormStateType<T = any> =
  | (ApiSuccessResponse<T> & {
      inputs?: Record<string, FormDataEntryValue>;
      errors?: never;
    })
  | (ApiErrorResponse<T> & {
      inputs?: Record<string, FormDataEntryValue>;
      errors?: FieldErrors;
    });

type HighlightedSkill = {
  index: number;
  type: string;
};

const LEVELS = ["beginner", "intermediate", "advanced", "expert"];
type Level = (typeof LEVELS)[number];

const levelPriority: Record<Level, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

const levelMeta: Record<Level, { label: string; badgeClass: string }> = {
  expert: { label: "Expert", badgeClass: "badge badge-gradient" },
  advanced: { label: "Advanced", badgeClass: "badge badge-purple" },
  intermediate: { label: "Intermediate", badgeClass: "badge badge-blue" },
  beginner: { label: "Beginner", badgeClass: "badge glass" },
};

const SkillsForm = ({
  isOpen,
  onClose,
  initialData = [],
  onSave,
}: SkillsFormProps) => {
  const [skills, setSkills] = useState<Skill[]>(initialData);
  const [inputLevel, setInputLevel] = useState<Level>("beginner");
  const [highlightedSkill, setHighlightedSkill] =
    useState<HighlightedSkill | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const { showToast } = useToast();

  const validateSkill = (val: string): string => {
    if (!val?.trim()) return "";

    const { message } = stringPropertiesValidator(
      "skill",
      val,
      propertyConstraints.minStringLength,
      propertyConstraints.maxStringLength,
    );

    return message ?? "";
  };

  const skillInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: validateSkill,
  });

  const initialState: ProfileFormStateType = {
    success: false,
    status: "IDLE",
    code: "INITIAL",
    statusCode: 0,
    message: "",
    details: null,
    timestamp: new Date().toISOString(),
    metadata: null,
    errors: {},
    inputs: {},
  };

  const action = async (
    prevState: ProfileFormStateType,
    formData: FormData,
  ): Promise<ProfileFormStateType> => updateSkills(prevState, formData);

  const [state, skillsFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  const addSkill = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return;

    const error = validateSkill(value);
    if (error) {
      skillInput.handleInput(value);
      skillInput.handleBlur();
      return;
    }

    const existingIndex = skills.findIndex(
      (s) => s.name.toLowerCase() === trimmed,
    );

    if (existingIndex !== -1) {
      const existingSkill = skills[existingIndex];

      const existingLevelPriority = levelPriority[existingSkill.level as Level];
      const newLevelPriority = levelPriority[inputLevel];

      if (existingLevelPriority === newLevelPriority) {
        setHighlightedSkill({ index: existingIndex, type: "error" });

        setTimeout(() => {
          setHighlightedSkill(null);
        }, 5000);

        showToast({
          title: "SKILL ADD FAILED",
          message: `${toTitleCase(trimmed)} with same level already exists!`,
          variant: "warning",
        });

        skillInput.reset();
        return;
      }

      if (newLevelPriority > existingLevelPriority) {
        setSkills((prev) =>
          prev.map((s, i) =>
            i === existingIndex ? { ...s, level: inputLevel } : s,
          ),
        );

        setHighlightedSkill({ index: existingIndex, type: "success" });

        setTimeout(() => {
          setHighlightedSkill(null);
        }, 5000);

        showToast({
          title: "SKILL ADD SUCCESS",
          message: `${toTitleCase(trimmed)} upgraded to ${toTitleCase(inputLevel)}!`,
          variant: "success",
        });

        skillInput.reset();
        return;
      }

      setHighlightedSkill({ index: existingIndex, type: "warning" });

      setTimeout(() => {
        setHighlightedSkill(null);
      }, 5000);

      showToast({
        title: "SKILL ADD IGNORED",
        message: `${toTitleCase(trimmed)} already has higher level`,
        variant: "info",
      });

      skillInput.reset();
      return;
    }

    setSkills((prev) => [...prev, { name: trimmed, level: inputLevel }]);

    skillInput.reset();
    inputRef.current?.focus();
  };

  const removeSkill = (idx: number) =>
    setSkills((prev) => prev.filter((_, i) => i !== idx));

  const updateLevel = (idx: number, level: Level) =>
    setSkills((prev) => prev.map((s, i) => (i === idx ? { ...s, level } : s)));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(skillInput.raw);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSkills(initialData);
      setInputLevel("beginner");
      skillInput.reset();
    }
  }, [isOpen]);

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (state?.success) {
      showToast({
        title: state.status,
        message: state.message ?? "Profile updated successfully!",
        variant: "success",
      });
      onSave(skills);
      onClose();
    } else {
      showToast({
        title: state.code,
        message: state.message,
        variant: "error",
      });
    }
  }, [state]);

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Tech Stack & Skills"
      subtitle="Add skills and set your proficiency level"
      maxWidth="max-w-xl"
      footer={
        <>
          <FormButton
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </FormButton>

          <FormButton
            type="submit"
            variant="primary"
            form="skills-form"
            loading={isPending}
            disabled={isPending || skills.length === 0}
          >
            Save Changes
          </FormButton>
        </>
      }
    >
      <Form id="skills-form" action={skillsFormAction}>
        <div className="flex sm:flex-row flex-col items-start gap-3">
          <FormField
            label="Skill Name"
            htmlFor="skill-name"
            error={skillInput.error}
          >
            <FormInput
              ref={inputRef}
              id="skill-name"
              name="skill-name"
              placeholder="e.g. React JS, Next JS..."
              autoComplete="off"
              value={skillInput.raw}
              onChange={(e) => skillInput.handleInput(e.currentTarget.value)}
              onBlur={skillInput.handleBlur}
              error={skillInput.error}
              onKeyDown={handleKeyDown}
            />
          </FormField>

          <FormField label="Level" htmlFor="skill-level">
            <FormSelect
              id="skill-level"
              value={inputLevel}
              onChange={(val) => setInputLevel(val as Level)}
              options={LEVELS.map((l) => ({
                value: l,
                label: levelMeta[l].label,
              }))}
            />
          </FormField>

          <div className="sm:mt-6 shrink-0">
            <FormButton
              type="button"
              variant="primary"
              onClick={() => addSkill(skillInput.raw)}
              className="mt-1"
            >
              <LuPlus size={18} />
              Add
            </FormButton>
          </div>
        </div>

        <input type="hidden" name="skills" value={JSON.stringify(skills)} />

        {skills.length > 0 && (
          <>
            <FormDivider
              label={`${skills.length} skill${skills.length > 1 ? "s" : ""} added`}
            />

            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, idx) => (
                <div
                  key={skill.name}
                  className={`group relative pr-2 cursor-default btn btn-secondary transition-all ease-in-out ${highlightedSkill?.index === idx ? `ring-2 ring-status-warning-border alert-pulse bg-status-${highlightedSkill.type}-bg alert-${highlightedSkill.type}` : ""}`}
                >
                  {skill.icon && (
                    // <Image
                    //   src={skill.icon}
                    //   alt={skill.name}
                    //   width={100}
                    //   height={100}
                    //   className="opacity-80 group-hover:opacity-100 w-4 h-4 transition-opacity"
                    // />
                    <></>
                  )}

                  <span className="font-medium text-text-secondary group-hover:text-text-primary text-sm transition-colors">
                    {toTitleCase(skill.name)}
                  </span>

                  <span
                    className={`ml-1 px-2 py-0.5 text-xs badge  ${skill.level === "expert" ? "badge-gradient" : skill.level === "advanced" ? "badge-purple" : skill.level === "intermediate" ? "badge-blue" : "glass"}`}
                  >
                    {toTitleCase(skill.level)}
                  </span>

                  <button
                    onClick={() => removeSkill(idx)}
                    className="flex justify-center items-center hover:bg-status-error-bg p-0 border border-transparent hover:border-status-error-border rounded-full w-5 h-5 text-text-muted hover:text-status-error-text transition-all ease-in-out"
                    aria-label={`Remove ${skill.name}`}
                  >
                    <LuX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {skills.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-text-muted">
            <LuCode size={28} className="opacity-40" />
            <p className="text-sm">No skills added yet. Type above to start.</p>
          </div>
        )}
      </Form>
    </ModalPortal>
  );
};

export default SkillsForm;
