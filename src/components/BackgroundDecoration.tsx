import { getThemeSettings, getPatternOpacity, getGlowOpacity } from "@/lib/themeStore";

interface Props {
  id?: string;
}

const BackgroundDecoration = ({ id = "bg" }: Props) => {
  const settings = getThemeSettings();
  const patternOpacity = getPatternOpacity(settings);
  const glowOpacity = getGlowOpacity(settings);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {settings.glowEnabled && (
        <>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: `hsl(var(--primary) / ${glowOpacity})` }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: `hsl(var(--accent) / ${glowOpacity * 1.3})` }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl" style={{ background: `hsl(var(--primary) / ${glowOpacity * 0.7})` }} />
        </>
      )}
      {settings.pattern !== "none" && (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: patternOpacity }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            {settings.pattern === "grid" ? (
              <pattern id={`${id}-pattern`} width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            ) : (
              <pattern id={`${id}-pattern`} width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="currentColor" />
              </pattern>
            )}
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id}-pattern)`} />
        </svg>
      )}
    </div>
  );
};

export default BackgroundDecoration;
