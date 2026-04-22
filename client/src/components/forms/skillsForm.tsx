"use client";

import { useState, useEffect, useRef } from "react";
import { LuPlus, LuX, LuCode } from "react-icons/lu";
import ModalPortal from "@/components/forms/modalPortal";
import {
  FormField,
  FormInput,
  FormSelect,
  FormButton,
  FormDivider,
} from "@/components/forms/formPrimitives";

type Skill = {
  name: string;
  level: string;
  icon?: string;
};

type SkillsFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Skill[];
  onSave: (skills: Skill[]) => Promise<void>;
};

const LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;
type Level = (typeof LEVELS)[number];

const levelMeta: Record<Level, { label: string; badgeClass: string }> = {
  expert: { label: "Expert", badgeClass: "badge badge-gradient" },
  advanced: { label: "Advanced", badgeClass: "badge badge-purple" },
  intermediate: { label: "Intermediate", badgeClass: "badge badge-blue" },
  beginner: { label: "Beginner", badgeClass: "badge glass" },
};

const toTitleCase = (str: string) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );

const SkillsForm = ({
  isOpen,
  onClose,
  initialData = [],
  onSave,
}: SkillsFormProps) => {
  const [skills, setSkills] = useState<Skill[]>(initialData);
  const [inputName, setInputName] = useState("");
  const [inputLevel, setInputLevel] = useState<Level>("intermediate");
  const [inputError, setInputError] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSkills(initialData);
      setInputName("");
      setInputLevel("intermediate");
      setInputError("");
    }
  }, [isOpen]);

  const addSkill = () => {
    const name = inputName.trim().toLowerCase();
    if (!name) {
      setInputError("Enter a skill name.");
      return;
    }
    if (skills.some((s) => s.name.toLowerCase() === name)) {
      setInputError("This skill is already added.");
      return;
    }
    setSkills((prev) => [...prev, { name, level: inputLevel }]);
    setInputName("");
    setInputError("");
    inputRef.current?.focus();
  };

  const removeSkill = (idx: number) =>
    setSkills((prev) => prev.filter((_, i) => i !== idx));

  const updateLevel = (idx: number, level: Level) =>
    setSkills((prev) => prev.map((s, i) => (i === idx ? { ...s, level } : s)));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = async () => {
    if (skills.length === 0) return;
    setSaving(true);
    try {
      await onSave(skills);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Tech Stack & Skills"
      subtitle="Add skills and set your proficiency level"
      maxWidth="max-w-xl"
      footer={
        <>
          <FormButton variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </FormButton>
          <FormButton
            variant="primary"
            onClick={handleSave}
            loading={saving}
            disabled={skills.length === 0}
          >
            Save Changes
          </FormButton>
        </>
      }
    >
      <div className="flex sm:flex-row flex-col items-start gap-3">
        <FormField label="Skill Name" htmlFor="skill-name" error={inputError}>
          <FormInput
            ref={inputRef}
            id="skill-name"
            placeholder="e.g. React JS"
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value);
              setInputError("");
            }}
            onKeyDown={handleKeyDown}
            error={inputError}
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
          <FormButton variant="primary" onClick={addSkill}>
            <LuPlus size={18} />
            Add
          </FormButton>
        </div>
      </div>

      {skills.length > 0 && (
        <>
          <FormDivider
            label={`${skills.length} skill${skills.length > 1 ? "s" : ""} added`}
          />

          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill, idx) => (
              <div
                key={skill.name}
                className="group relative pr-2 transition-all cursor-default btn btn-secondary"
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
    </ModalPortal>
  );
};

export default SkillsForm;
