type Skill = {
  name: string;
  level: string;
  icon: string;
};

type TechStackProps = { skills: Skill[] };

export default function TechStack({ skills }: TechStackProps) {
  return (
    <div className="bg-surface/50 shadow-lg backdrop-blur-md mb-6 p-6 border border-white/5 rounded-2xl">
      <h2 className="mb-6 font-semibold text-white text-xl">
        Tech Stack & Expertise
      </h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="group relative flex items-center gap-2 bg-white/5 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/10 px-4 py-2 border border-white/10 hover:border-primary/30 rounded-full hover:scale-105 transition-all cursor-default"
          >
            {skill.icon && (
              <img
                src={skill.icon}
                alt={skill.name}
                className="opacity-80 group-hover:opacity-100 w-4 h-4 transition-opacity"
              />
            )}
            <span className="font-medium text-text-primary group-hover:text-white text-sm transition-colors">
              {skill.name}
            </span>
            <span className="bg-black/30 ml-1 px-2 py-0.5 border border-white/5 rounded-md text-text-secondary text-xs">
              {skill.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
