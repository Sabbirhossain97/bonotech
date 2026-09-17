import FlowBackground from "./FlowBackground";

const Hero = () => {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[800px] min-h-[100svh] overflow-hidden bg-[#160d29] px-[22px] sm:px-8 lg:px-[clamp(40px,3.15vw,64px)]"
    >
      {/* Animated background */}
      <FlowBackground className="absolute inset-0 -z-30" />

      {/* Readability overlays */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(17,9,30,0.19)_0%,rgba(17,9,30,0.04)_21%,rgba(17,9,30,0.30)_46%,rgba(17,9,30,0.16)_77%,rgba(17,9,30,0.42)_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(17,9,30,0.25)_0%,transparent_35%,transparent_65%,rgba(17,9,30,0.18)_100%)]"
      />

      {/* Bottom fade into next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[clamp(150px,25vh,280px)] bg-gradient-to-b from-transparent to-[#08060c]"
      />

      <div className="mx-auto flex min-h-[800px] min-h-[100svh] w-full max-w-[1480px] flex-1 flex-col justify-center py-12 sm:py-14 lg:py-[clamp(50px,7vh,78px)]">
        {/* Top composition */}
        <div className="mx-auto grid w-full max-w-[1480px] grid-cols-1 items-center gap-7 md:grid-cols-[1fr_220px_1fr] md:items-start md:gap-6 lg:grid-cols-[1fr_minmax(250px,29%)_1fr] lg:gap-[clamp(30px,4vw,80px)]">
          {/* Left copy */}
          <div className="order-2 mx-auto max-w-[330px] text-center md:order-1 md:mx-0 md:mt-[clamp(5px,1.5vh,18px)] md:justify-self-end md:border-r md:border-[#ddcbf9]/40 md:pr-5 md:text-right lg:max-w-[360px]">
            <p className="m-0 text-[16px] font-normal leading-[1.42] tracking-[-0.045em] text-[#e7e0f3] [text-shadow:0_2px_18px_rgba(15,5,30,0.65)] md:text-[16px] lg:text-[clamp(18px,1.36vw,23px)]">
              Bonotech turns
              <br />
              <strong className="font-bold text-[#f9f5ff]">
                business needs
              </strong>
              <br />
              into{" "}
              <strong className="font-bold text-[#f9f5ff]">
                software
              </strong>
              <br />
              built with{" "}
              <strong className="font-bold text-[#f9f5ff]">
                precision
              </strong>
              <br />
              <strong className="font-bold text-[#f9f5ff]">
                and speed.
              </strong>
            </p>
          </div>

          {/* Home key */}
          <div className="order-1 flex justify-center md:order-2 md:pt-[55px] lg:pt-[clamp(44px,6.5vh,76px)]">
            <div className="relative isolate aspect-[1.115] w-[185px] rounded-[16%] sm:w-[205px] md:w-[205px] lg:w-[clamp(225px,18.3vw,302px)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[7%] bottom-0 top-[12%] -z-10 translate-y-2 rounded-[22%] bg-[rgba(8,2,18,0.42)] blur-[12px] shadow-[0_14px_24px_rgba(7,1,16,0.4),0_30px_48px_rgba(7,1,16,0.26)]"
              />

              <img
                src="/hero-section/home-key.png"
                alt=""
                aria-hidden="true"
                draggable={false}
                className="pointer-events-none absolute left-[-38.7%] top-[-27.4%] h-auto w-[180.8%] max-w-none select-none object-contain"
              />
            </div>
          </div>

          {/* Right copy */}
          <div className="order-3 mx-auto max-w-[350px] text-center md:mx-0 md:mt-[clamp(5px,1.5vh,18px)] md:max-w-[320px] md:justify-self-start md:border-l md:border-[#ddcbf9]/40 md:pl-5 md:text-left lg:max-w-[390px]">
            <p className="m-0 text-[16px] font-normal leading-[1.42] tracking-[-0.045em] text-[#e7e0f3] [text-shadow:0_2px_18px_rgba(15,5,30,0.65)] md:text-[16px] lg:text-[clamp(18px,1.36vw,23px)]">
              From{" "}
              <strong className="font-bold text-[#f9f5ff]">
                custom software
              </strong>
              <br className="hidden lg:block" />
              <span>
                {" "}
                to{" "}
                <strong className="font-bold text-[#f9f5ff]">
                  applied AI
                </strong>
                , we move fast,
              </span>

              <br className="hidden lg:block" />

              <span>
                {" "}
                refine faster and{" "}
                <strong className="font-bold text-[#f9f5ff]">
                  engineer
                </strong>
              </span>

              <br className="hidden lg:block" />

              <strong className="font-bold text-[#f9f5ff]">
                technology
              </strong>

              <span> around how</span>

              <br className="hidden lg:block" />

              <span> businesses actually work.</span>
            </p>
          </div>
        </div>

        {/* Main heading */}
        <h1
          id="hero-title"
          aria-label="Home of exceptional engineering"
          className="relative z-10 mt-10 w-full font-bold uppercase leading-[0.80] tracking-[-0.045em] [text-shadow:0_3px_40px_rgba(19,8,41,0.1)] sm:mt-11 md:mt-10 lg:mt-[clamp(30px,4.1vh,48px)]"
        >
          <span
            aria-hidden="true"
            className="block whitespace-nowrap text-center text-[clamp(2.8rem,9.06vw,8.5rem)] text-[#f9f7ff]"
          >
            OF EXCEPTIONAL
          </span>

          <span
            aria-hidden="true"
            className="mt-0 block whitespace-nowrap text-center text-[clamp(2.8rem,9.06vw,8.5rem)] text-[#ddd0fb]"
          >
            ENGINEERING
          </span>
        </h1>
      </div>
    </section>
  );
};

export default Hero;