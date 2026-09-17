import fasterDevelopmentImage from "@/assets/sprint-matrics-sections/faster_development.png";
import fasterQaCyclesImage from "@/assets/sprint-matrics-sections/faster_qa_cycles.png";
import lessRepetitiveWorkImage from "@/assets/sprint-matrics-sections/less_repetitive_work.png";

const SprintMetricsSection = () => {
    return (
        <section className="bg-[#0D0618] py-20 lg:py-28">
            <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 xl:px-0">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
                    {/* Card 01 */}
                    <article className="flex min-h-[620px] flex-col overflow-hidden xl:h-[737px] xl:min-h-0">
                        {/* Heading */}
                        <div className="pb-7 xl:h-[180px] xl:pb-0">
                            <div className="mb-3 flex gap-[5px]">
                                <span className="h-[7px] w-[7px] bg-[#B98AFF]" />
                                <span className="h-[7px] w-[7px] bg-[#B98AFF]" />
                                <span className="h-[7px] w-[7px] bg-[#B98AFF]" />
                                <span className="h-[7px] w-[7px] bg-[#B98AFF]" />
                            </div>

                            <h2 className="max-w-[330px] text-[40px] font-light leading-[0.98] tracking-[-0.04em] text-white md:text-[42px] xl:text-[44px]">
                                Numbers That
                                <br />
                                Define Our
                                <br />
                                <span className="font-semibold text-[#B98AFF]">Sprints</span>
                            </h2>
                        </div>

                        {/* Visible card */}
                        <div className="flex flex-1 flex-col rounded-[4px] bg-white px-7 pb-7 pt-7 text-[#2A1554] xl:h-[557px] xl:flex-none xl:px-8">
                            <div className="mb-7 flex items-center justify-between">
                                <span className="text-[12px] text-[#AAA0BD]">01</span>

                                <span className="relative block h-[17px] w-[17px]">
                                    <span className="absolute bottom-0 left-0 h-[12px] w-[12px] border border-[#9385AB]" />
                                    <span className="absolute right-0 top-0 h-[5px] w-[5px] bg-[#9385AB]" />
                                </span>
                            </div>

                            <div className="mb-2 flex items-end">
                                <span className="text-[82px] font-light leading-[0.9] tracking-[-0.065em] md:text-[90px]">
                                    400
                                </span>
                                <span className="ml-2 pb-[5px] text-[46px] font-light leading-none">
                                    %
                                </span>
                            </div>

                            <h3 className="mb-3 text-[22px] font-bold leading-tight tracking-[-0.035em]">
                                Faster Development
                            </h3>

                            <p className="max-w-[320px] text-[16px] font-light leading-[1.5] text-[#6F667E]">
                                Focused sprints, one team across the whole surface, and no
                                hand-off lag between disciplines.
                            </p>

                            <div className="mt-auto flex justify-center pt-6">
                                <img
                                    src={fasterDevelopmentImage}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-auto w-full max-w-[320px]"
                                />
                            </div>
                        </div>
                    </article>

                    {/* Card 02 */}
                    <article className="flex min-h-[620px] flex-col overflow-hidden xl:h-[737px]">
                        {/* Illustration */}
                        <div className="flex min-h-[200px] items-center justify-center bg-[#EFE8F8] px-5 py-6 xl:h-[267px] xl:min-h-0 xl:py-0">
                            <img
                                src={lessRepetitiveWorkImage}
                                alt=""
                                aria-hidden="true"
                                className="h-[167px] w-full max-w-[320px] object-contain"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col bg-[#EFE8F8] px-7 pb-8 pt-5 text-[#2A1554] xl:px-8">
                            <div className="mb-5 flex items-center justify-between">
                                <span className="text-[12px] text-[#AAA0BD]">02</span>

                                <span className="relative block h-[17px] w-[17px]">
                                    <span className="absolute bottom-0 left-0 h-[12px] w-[12px] border border-[#9385AB]" />
                                    <span className="absolute right-0 top-0 h-[5px] w-[5px] bg-[#9385AB]" />
                                </span>
                            </div>

                            <div className="mb-2 flex items-end">
                                <span className="text-[82px] font-light leading-[0.9] tracking-[-0.065em] md:text-[90px]">
                                    40
                                </span>
                                <span className="ml-2 pb-[5px] text-[46px] font-light leading-none">
                                    %
                                </span>
                            </div>

                            <h3 className="mb-3 text-[22px] font-bold leading-tight tracking-[-0.035em]">
                                Less Repetitive Work
                            </h3>

                            <p className="max-w-[320px] text-[16px] font-light leading-[1.5] text-[#6F667E]">
                                AI-assisted capture, validation and intelligent RPA take the
                                re-keying out of the day.
                            </p>
                        </div>

                        {/* Empty lower area */}
                        <div className="hidden bg-transparent xl:block xl:h-[180px]" />
                    </article>

                    {/* Card 03 */}
                    <article className="flex min-h-[620px] flex-col overflow-hidden xl:h-[737px] xl:justify-end">
                        {/* Desktop empty top area */}
                        <div className="hidden xl:block xl:h-[180px]" />

                        {/* Visible card */}
                        <div className="flex flex-1 flex-col rounded-[4px] bg-[#6F2BE6] px-7 pb-7 pt-7 text-white xl:h-[557px] xl:flex-none xl:px-8">
                            <div className="mb-7 flex items-center justify-between">
                                <span className="text-[12px] text-[#BFA1FF]">03</span>

                                <span className="relative block h-[17px] w-[17px]">
                                    <span className="absolute bottom-0 left-0 h-[12px] w-[12px] border border-[#CBB4FF]" />
                                    <span className="absolute right-0 top-0 h-[5px] w-[5px] bg-[#CBB4FF]" />
                                </span>
                            </div>

                            <div className="mb-2 flex items-end">
                                <span className="text-[82px] font-light leading-[0.9] tracking-[-0.065em] md:text-[90px]">
                                    200
                                </span>
                                <span className="ml-2 pb-[5px] text-[46px] font-light leading-none">
                                    %
                                </span>
                            </div>

                            <h3 className="mb-3 text-[22px] font-bold leading-tight tracking-[-0.035em]">
                                Faster QA Cycles
                            </h3>

                            <p className="max-w-[320px] text-[16px] font-light leading-[1.5] text-[#E1D4FB]">
                                Automated regression and continuous checks, so hardening does
                                not become its own project.
                            </p>

                            <div className="mt-auto flex justify-center pt-6">
                                <img
                                    src={fasterQaCyclesImage}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-[167px] w-full max-w-[320px] object-contain"
                                />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default SprintMetricsSection;