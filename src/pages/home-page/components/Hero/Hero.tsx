import FlowBackground from "./FlowBackground";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <FlowBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-300 flex-col px-5 ">
        <div className="mx-auto flex w-full flex-1 flex-col justify-center">
          {/* Top content */}
          <div className="grid w-full grid-cols-1 items-center gap-7 md:grid-cols-[1fr_220px_1fr] md:gap-8 lg:grid-cols-[1fr_260px_1fr] lg:gap-12 xl:grid-cols-[1fr_300px_1fr] xl:gap-16">
            {/* Left copy */}
            <div className="order-2 mx-auto max-w-[320px] md:pr-6 md:border-r md:border-white/25 text-center md:order-1 md:mx-0 md:justify-self-end md:max-w-[250px] md:text-right lg:max-w-[280px]">
              <p className="text-[16px] font-light leading-[1.45] tracking-[-0.02em] text-white/85 md:text-[17px] lg:text-[19px] xl:text-[20px]">
                Bonotech turns
                <br />
                <span className="font-semibold text-white">business needs</span>
                <br />
                into <span className="font-semibold text-white">software</span>
                <br />
                built with <span className="font-semibold text-white">precision</span>
                <br />
                <span className="font-semibold text-white">and speed.</span>
              </p>
            </div>

            {/* Home key */}
            <div className="order-1 flex justify-center md:order-2">
              <img
                src="/hero-section/home-key.png"
                alt="Home"
                className="w-[170px] object-contain sm:w-[190px] md:w-[210px] lg:w-[250px] xl:w-[290px]"
              />
            </div>

            {/* Right copy */}
            <div className="order-3 mx-auto max-w-[350px] text-center md:mx-0 md:max-w-[300px] md:justify-self-start md:border-l md:border-white/25 md:pl-6 md:text-left lg:max-w-[350px] lg:pl-8 xl:max-w-[390px]">
              <p className="text-[16px] font-light leading-[1.45] tracking-[-0.02em] text-white/85 md:text-[17px] lg:text-[19px] xl:text-[20px]">
                From <span className="font-semibold text-white">custom software</span>
                <br className="hidden lg:block" />
                {" "}to <span className="font-semibold text-white">applied AI</span>, we move fast,
                <br className="hidden lg:block" />
                {" "}refine faster and <span className="font-semibold text-white">engineer</span>
                <br className="hidden lg:block" />
                <span className="font-semibold text-white">technology</span> around how
                <br className="hidden lg:block" />
                {" "}businesses actually work.
              </p>
            </div>
          </div>

          {/* Main heading */}
          <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-12 xl:mt-14">
            <h1 className="text-center font-semibold uppercase tracking-[-0.065em]">
              <span className="block whitespace-nowrap text-[clamp(2.8rem,8.6vw,7.8rem)] leading-[0.9] text-white">
                Of Exceptional
              </span>

              <span className="mt-1 block text-[clamp(2.8rem,8.6vw,7.8rem)] leading-[0.9] text-[#c7a4ff]">
                Engineering
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;