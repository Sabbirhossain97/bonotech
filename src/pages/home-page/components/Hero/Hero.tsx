import FlowBackground from "./FlowBackground"

const Hero = () => {

  return (
    <section className="relative min-h-screen overflow-hidden">
      <FlowBackground />

      <div className="relative z-10">
        Your content here
      </div>
    </section>
  )
}

export default Hero