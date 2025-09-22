import { Checkbox, Modal } from "antd";

export const PayButton = ({ user, total, exchangeId, setIsLoading }) => {
  const [userBalance, setUserBalance] = useState(0);
  const [checked, setChecked] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          if (userBalance < total) setAmount(total - userBalance);
          setIsConfirming(true);
        }}
        className="bg-sky-700 py-2 text-white text-xs font-semibold rounded-md duration-200 hover:bg-sky-900"
      >
        THANH TOÁN BẰNG VÍ
      </button>

      {isConfirming && (
        <Modal
          open={isConfirming}
          onCancel={(e) => {
            e.stopPropagation();
            setChecked(false);
            setAmount(0);
            // setPaymentGateway(undefined);
            setIsConfirming(false);
          }}
          centered
          footer={null}
        >
          <div className="flex flex-col gap-4">
            <p className="font-bold text-lg">XÁC NHẬN THANH TOÁN</p>

            <div className="flex flex-col gap-2">
              <p className="text-red-600">Lưu ý trước khi thanh toán:</p>

              <div className="flex flex-col gap-1 px-4">
                <p className="font-light text-xs">
                  &#8226;&emsp;Số tiền thanh toán giữa hai người có thể khác
                  nhau trong cùng một trao đổi vì phí giao hàng có thể khác
                  nhau.
                </p>
                <p className="font-light text-xs">
                  &#8226;&emsp;Tiền cọc sẽ được hoàn lại chỉ khi cả hai người
                  tham gia trao đổi xác nhận đã nhận truyện thành công.
                </p>
                <p className="font-light text-xs">
                  &#8226;&emsp;Nếu có vấn đề xảy ra và được xác định là do một
                  trong hai người trao đổi, toàn bộ số tiền cọc sẽ được chuyển
                  về cho người đối diện.
                </p>
                <p className="font-light text-xs">
                  &#8226;&emsp;Phí giao hàng sẽ không được hoàn trả.
                </p>
              </div>
            </div>



            <div className="flex items-center gap-2 px-4">
              <Checkbox
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
              <p className="text-xs font-light cursor-default">
                Xác nhận tiến hành thanh toán
              </p>
            </div>

            <div className="flex self-stretch gap-2">
              <button
                className="basis-1/3 hover:underline"
                onClick={() => setIsConfirming(false)}
              >
                Quay lại
              </button>
              <button
                disabled={
                  !checked || (amount + userBalance < total )
                }
                className="basis-2/3 py-2 bg-sky-700 text-white font-semibold rounded-md duration-200 hover:bg-sky-800 disabled:bg-gray-300"
                // onClick={() => {
                //   if (userBalance < total) redirectToPay();
                //   else handlePayment();
                // }}
              >
                {userBalance < total ? "NẠP TIỀN VÀ THANH TOÁN" : "THANH TOÁN"}
              </button>
            </div>
          </div>

        </Modal>
      )}
    </div>
  );
};
