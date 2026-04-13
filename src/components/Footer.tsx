export default function Footer() {
  return (
    <div className="bg-[var(--surface-black)] w-full px-[clamp(24px,8vw,160px)] py-[clamp(80px,12vw,200px)] flex flex-col items-center gap-[clamp(60px,8vw,150px)]">
      <p className="font-domine font-normal text-[clamp(32px,8vw,64px)] leading-[1.1] tracking-[-1.28px] text-[var(--surface-white)] text-center">
        Get in touch
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-[1600px]">
        <a
          href="mailto:carlfiler@me.com"
          className="bg-[var(--black-elevation)] hover:bg-[#2a2929] rounded-[clamp(24px,5vw,80px)] flex items-center justify-between px-[clamp(24px,5vw,100px)] py-[clamp(40px,5vw,100px)] no-underline transition-all duration-150 ease-out active:scale-[0.96]"
        >
          <span className="font-domine font-normal text-[clamp(16px,2vw,24px)] leading-[1.4] tracking-[-0.48px] text-[var(--surface-white)]">
            carlfiler@me.com
          </span>
          <img src="/images/icon-arrow.svg" alt="" className="w-6 h-6" />
        </a>
        <a
          href="https://www.linkedin.com/in/carlfiler"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[var(--black-elevation)] hover:bg-[#2a2929] rounded-[clamp(24px,5vw,80px)] flex items-center justify-between px-[clamp(24px,5vw,100px)] py-[clamp(40px,5vw,100px)] no-underline transition-all duration-150 ease-out active:scale-[0.96]"
        >
          <span className="font-domine font-normal text-[clamp(16px,2vw,24px)] leading-[1.4] tracking-[-0.48px] text-[var(--surface-white)]">
            LinkedIn
          </span>
          <img src="/images/icon-arrow.svg" alt="" className="w-6 h-6" />
        </a>
      </div>
    </div>
  )
}
