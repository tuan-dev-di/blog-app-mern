import { Link } from "react-router-dom";

import { Button } from "flowbite-react";

const Introduce = () => {
  return (
    <div className="flex flex-col sm:flex-row p-5 border border-teal-400 rounded-tl-3xl rounded-br-3xl justify-center items-center text-center">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl font-semibold">
          Do you want to be a Web Developer with JavaScript?
        </h2>
        <p className="text-gray-400">
          Check this place, you will find many free courses!
        </p>
        <Button gradientDuoTone="pinkToOrange">
          <Link className="block" to="https://fullstack.edu.vn/">
            F8 - Học Lập Trình Để Đi Làm
          </Link>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          className="w-[540px] h-[320px]"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYxYxLwSX1TK26Pe820t3nBJ6FPnYt3lBJMg&s"
          alt="F8 - Coder Lifestyle"
        />
      </div>
    </div>
  );
};

export default Introduce;
