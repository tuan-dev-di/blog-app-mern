import Amy_Sorry from "../assets/Amy_Sorry.jpg";

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-5xl mx-auto p-3 text-center ">
        <h1 className="text-5xl font font-semibold text-center my-7">
          Đang trong trạng thái cập nhật...
        </h1>
        <div className="text-md text-pretty text-lg p-5 text-gray-500 flex flex-col gap-6 items-center">
          <p>Chức năng này này hiện mình chưa cập nhật lại</p>

          <p>Xin lỗi vì sự bất tiện này</p>
          <img src={Amy_Sorry} alt="Amy_Sorry" className="w-40 h-40" />
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
