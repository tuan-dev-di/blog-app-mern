import { Footer } from "flowbite-react";
import { BsFacebook, BsGithub } from "react-icons/bs";
import Ami_Chill from "../assets/Ami_ChillChill.jpg";

const FooterComponent = () => {
  return (
    // <Footer container>
    //   <Footer.Copyright
    //     href="https://github.com/tuan-dev-di"
    //     by="Arys Domi"
    //     year={2024}
    //   />
    //   <div className="grid gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-6">
    //     <Footer.Title title="Privacy Policy" />
    //     <Footer.Title title="Outstanding" />
    //     <Footer.Title title="Contact" />

    //   </div>
    // </Footer>
    <Footer container className="border-t-2">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1 ">
          <div className="mt-5">
            <Footer.Brand
              href="https://github.com/tuan-dev-di"
              src={Ami_Chill}
              alt="Arys Domi"
              name="Arys Domi"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6 mt-5">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Flowbite</Footer.Link>
                <Footer.Link href="#">Tailwind CSS</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Github</Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="https://github.com/tuan-dev-di"
            by="Arys Domi"
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsGithub} />
            {/* <Footer.Icon href="#" icon={BsDribbble} /> */}
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
