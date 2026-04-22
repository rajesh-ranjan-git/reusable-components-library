"use client";

import { useState, useEffect, useRef } from "react";
import { LuPlus, LuX, LuSparkles } from "react-icons/lu";
import ModalPortal from "@/components/forms/modalPortal";
import {
  FormInput,
  FormButton,
  FormDivider,
} from "@/components/forms/formPrimitives";

type InterestsFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string[];
  onSave: (interests: string[]) => Promise<void>;
};

const SUGGESTIONS = [
  "Open Source",
  "Machine Learning",
  "UI/UX Design",
  "Web3",
  "Game Dev",
  "Photography",
  "Music",
  "Hiking",
  "Reading",
  "Taekwondo",
  "Travel",
  "Cooking",
  "Fitness",
  "Chess",
  "Writing",
];

const toTitleCase = (str: string) =>
  str.replace(
    /\w\S*/g,
    (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(),
  );

const InterestsForm = ({
  isOpen,
  onClose,
  initialData = [],
  onSave,
}: InterestsFormProps) => {
  const [interests, setInterests] = useState<string[]>(initialData);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInterests(initialData);
      setInputValue("");
      setInputError("");
    }
  }, [isOpen]);

  const addInterest = (value: string = inputValue) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      setInputError("Enter an interest.");
      return;
    }
    if (interests.includes(trimmed)) {
      setInputError("Already added.");
      return;
    }
    setInterests((prev) => [...prev, trimmed]);
    setInputValue("");
    setInputError("");
    inputRef.current?.focus();
  };

  const removeInterest = (interest: string) =>
    setInterests((prev) => prev.filter((i) => i !== interest));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest();
    }
  };

  const handleSave = async () => {
    if (interests.length === 0) return;
    setSaving(true);
    try {
      await onSave(interests);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const unusedSuggestions = SUGGESTIONS.filter(
    (s) => !interests.includes(s.toLowerCase()),
  );

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Interests & Hobbies"
      subtitle="Share what you're passionate about"
      maxWidth="max-w-lg"
      footer={
        <>
          <FormButton variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </FormButton>
          <FormButton
            variant="primary"
            onClick={handleSave}
            loading={saving}
            disabled={interests.length === 0}
          >
            Save Changes
          </FormButton>
        </>
      }
    >
      <div className="flex gap-2">
        <div className="flex-1">
          <FormInput
            ref={inputRef}
            placeholder="e.g. Taekwondo, Coding, Travel…"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setInputError("");
            }}
            onKeyDown={handleKeyDown}
            error={inputError}
          />
          {inputError && (
            <p className="mt-1 text-status-error-text text-xs">{inputError}</p>
          )}
        </div>
        <FormButton variant="primary" onClick={() => addInterest()}>
          <LuPlus size={18} />
          Add
        </FormButton>
      </div>

      {interests.length > 0 && (
        <>
          <FormDivider label={`${interests.length} added`} />
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <div
                key={interest}
                className="group flex items-center gap-1.5 py-2 pr-1 pl-3 border border-glass-border-accent rounded-border-radius-pill transition-all glass"
              >
                <span className="font-medium text-text-secondary text-sm">
                  {toTitleCase(interest)}
                </span>
                <button
                  onClick={() => removeInterest(interest)}
                  className="flex justify-center items-center hover:bg-status-error-bg p-0 border border-transparent hover:border-status-error-border rounded-full w-5 h-5 text-text-muted hover:text-status-error-text transition-colors"
                  aria-label={`Remove ${interest}`}
                >
                  <LuX size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {unusedSuggestions.length > 0 && (
        <>
          <FormDivider label="Suggestions" />
          <div className="flex flex-wrap gap-2">
            {unusedSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addInterest(suggestion)}
                className="flex items-center gap-1.5 bg-glass-bg-subtle hover:bg-glass-bg px-3 py-1.5 border border-border-subtle hover:border-glass-border-accent rounded-pill text-text-muted hover:text-text-primary text-sm transition-all"
              >
                <LuPlus size={16} />
                {suggestion}
              </button>
            ))}
          </div>
        </>
      )}

      {interests.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-6 text-text-muted">
          <LuSparkles size={28} className="opacity-40" />
          <p className="text-sm">
            No interests yet — add some above or pick a suggestion.
          </p>
        </div>
      )}
    </ModalPortal>
  );
};

export default InterestsForm;
