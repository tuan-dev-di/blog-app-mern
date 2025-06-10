const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-5xl font font-semibold text-center my-7">
            About Arys&apos;s Blog
          </h1>
          <div className="text-md text-pretty text-lg p-5 text-gray-500 flex flex-col gap-6">
            <p>
              Welcome to Arys&apos;s Blog - my personal programming website!
              This is where I record the journey to study, explore and develop
              programming projects - from Backend to Frontend, from ideas to
              real products.
            </p>

            <p>
              This website is built with the goal of sharing knowledge,
              experience and programming resources that I have accumulated. I
              want to create a clear, easy -to -understand and useful space for
              both myself and those who are passionate about technology.
            </p>

            <p>
              If you are studying programming or working in the industry, boldly
              share your opinion, discuss or contribute ideas. Knowledge is
              really valuable when spreading and developing together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
