type SectionEdgeFadeProps = {
    top?: boolean;
    bottom?: boolean;
};

const SectionEdgeFade = ({ top = true, bottom = true }: SectionEdgeFadeProps) => (
    <>
        {top && <div aria-hidden="true" className="home-section-edge home-section-edge--top" />}
        {bottom && <div aria-hidden="true" className="home-section-edge home-section-edge--bottom" />}
    </>
);

export default SectionEdgeFade;
