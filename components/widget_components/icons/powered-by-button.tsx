export function PoweredByButton() {
  return (
    <a
      href="https://www.gistanswers.ai/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center hover:opacity-80 transition-opacity"
      aria-label="Powered by GistAnswers"
    >
      <img
        src="/assets/svgs/poweredbyfooter.svg"
        alt="Powered by GistAnswers"
        width={145}
        height={14}
        className="w-[145px] h-[14px]"
      />
    </a>
  );
}
