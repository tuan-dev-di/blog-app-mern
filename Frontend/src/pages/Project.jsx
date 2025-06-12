//? ---------------| IMPORT COMPONENTS |---------------
import { Button } from "flowbite-react";

const Project = () => {
  return (
    <div>
      <div className="min-h-screen max-w-4xl mx-auto flex justify-center gap-8 items-center flex-col p-6">
        <h1 className="text-4xl font-bold text-center">Những dự án của mình</h1>
        <Button color="gray" pill size="md" className="text-gray-500">
          Coming soon ...
        </Button>
        <p className="text-lg text-gray-600 text-center max-w-3xl">
          Đi sâu vào một bộ sưu tập các dự án thú vị và hấp dẫn được thiết kế để
          giúp đỡ mọi người học và làm chủ HTML, CSS và JavaScript. Cho dù bạn
          là người mới bắt đầu hoặc là lập trình viên có kinh nghiệm, các dự án
          này sẽ thách thức Kỹ năng của bạn và truyền cảm hứng sáng tạo. Bắt đầu
          xây dựng ngay hôm nay và lấy hành trình phát triển đến cấp độ tiếp
          theo!
        </p>
        <div className="w-full flex flex-col gap-6">
          <section className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold dark:text-gray-900">
              Tại sao phải tự làm các dự án (Projects)?
            </h2>
            <p className="text-gray-700 mt-2">
              Xây dựng các dự án là một trong những cách tốt nhất để học lập
              trình. Nó cho phép bạn áp dụng kiến thức lý thuyết một cách thực
              tế, giải quyết các vấn đề trong thế giới thực và tạo một danh mục
              đầu tư giới thiệu kỹ năng của bạn cho nhà tuyển dụng hoặc khách
              hàng tiềm năng.
            </p>
          </section>
          <section className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold dark:text-gray-900">
              Bạn sẽ học được những gì?
            </h2>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              <li> Cách cấu trúc HTML cho mã sạch và ngữ nghĩa </li>
              <li>
                Kiểu dáng với CSS để tạo ra các thiết kế hấp dẫn trực quan
              </li>
              <li> Thêm tính tương tác với JavaScript </li>
              <li> Kỹ thuật gỡ lỗi và giải quyết vấn đề </li>
              <li>
                Thực tiễn tốt nhất cho thiết kế web đáp ứng và có thể truy cập
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Project;
