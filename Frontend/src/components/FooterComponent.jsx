//? ---------------| IMPORT COMPONENTS |---------------
import { Footer } from "flowbite-react";
import { BsFacebook, BsGithub } from "react-icons/bs";
import Amy_Chill from "../assets/Amy_ChillChill.jpg";

const FooterComponent = () => {
  return (
    // Whole Footer
    <Footer container className="border-t-2">
      <div className="w-full">
        {/* ---------------| LOGO INFORMATION |---------------*/}
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1 ">
          <div className="mt-5">
            <Footer.Brand
              href="https://github.com/tuan-dev-di"
              src={Amy_Chill}
              alt="Arys Tommy"
              name="Arys Tommy"
            />
          </div>

          {/* ---------------| CONTACT INFORMATION |---------------*/}
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6 mt-5">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Flowbite</Footer.Link>
                <Footer.Link href="#">Tailwind CSS</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Contact" />
              <Footer.LinkGroup col>
                <Footer.Link href="tuanndt76@outlook.com">Mail</Footer.Link>
                <Footer.Link href="https://www.facebook.com/thanh.tuan.221793/">
                  Facebook
                </Footer.Link>
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
            by="Arys Tommy"
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
