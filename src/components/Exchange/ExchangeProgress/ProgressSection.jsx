import PropTypes from "prop-types";
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { Check, ChevronDown, FileText, Truck, CreditCard } from 'lucide-react';

const ProgressSection = (
  {
    firstCurrentStage,
    secondCurrentStage,
    exchangeDetail
  }
) => {

  const user = useSelector((state) => state.auth.user);

  const [currentUser, setCurrentUser] = useState('left');

  // console.log(exchangeData);
  const [firstUser, setFirstUser] = useState();
  const [secondUser, setSecondUser] = useState();


  // Bước hiện tại cho cả hai bên
  const [currentStepLeft, setCurrentStepLeft] = useState(firstCurrentStage);
  const [currentStepRight, setCurrentStepRight] = useState(secondCurrentStage);
  
  const leftSteps = [
    { name: "Điền thông tin vận chuyển", icon: <FileText size={20} /> },
    { name: "Xác nhận thông tin vận chuyển", icon: <FileText size={20} /> },
    { name: "Thanh toán", icon: <CreditCard size={20} /> },
    { name: "Theo dõi đơn hàng", icon: <Truck size={20} /> },
    { name: "Hoàn tất trao đổi", icon: <Check size={20} /> }
  ];

  const rightSteps = [
    { name: "Điền thông tin vận chuyển", icon: <FileText size={20} /> },
    { name: "Xác nhận thông tin vận chuyển", icon: <FileText size={20} /> },
    { name: "Thanh toán", icon: <CreditCard size={20} /> },
    { name: "Theo dõi đơn hàng", icon: <Truck size={20} /> },
    { name: "Hoàn tất trao đổi", icon: <Check size={20} /> }
  ];

  // Toggle user focus
  const switchUserFocus = () => {
    setCurrentUser(currentUser === 'left' ? 'right' : 'left');
  };


  // Render step with proper state
  const renderStep = (step, index, currentStep, side) => {
    const isCompleted = index < currentStep;
    const isCurrent = index === currentStep;
    const isInactive = side !== currentUser;

    return (
      <div className="flex flex-col items-center mb-2" key={`${side}-${index}`}>
        {/* Step icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
              ${isCompleted ? 'bg-green-500 text-white' :
              isCurrent ? 'border-2 border-green-500 text-green-500' :
                'bg-gray-200 text-gray-400'} 
              ${isInactive && !isCompleted ? 'opacity-50' : ''}`}
        >
          {step.icon}
        </div>

        {/* Step name */}
        <div className={`text-xs text-center ${isInactive && !isCompleted ? 'text-gray-400' : 'text-gray-700'}`}>
          {step.name}
        </div>

        {/* Connector arrow - except for last step */}
        {index < (side === 'left' ? leftSteps.length - 1 : rightSteps.length - 1) && (
          <div className="my-2">
            <ChevronDown
              size={20}
              className={`${isCompleted ? 'text-green-500' : 'text-gray-300'} ${isInactive ? 'opacity-50' : ''}`}
            />
          </div>
        )}

        {/* Special connector for last step */}
        {index === (side === 'left' ? leftSteps.length - 1 : rightSteps.length - 1) && index !== 0 && (
          <div className={`w-8 h-8 mt-1 ${side === 'left' ? 'transform rotate-45' : 'transform -rotate-45'}`}>
            <ChevronDown size={20} className={`${isCompleted ? 'text-green-500' : 'text-gray-300'}`} />
          </div>
        )}
      </div>
    );
  };


  useEffect(() => {
    if (user) {
      setFirstUser(exchangeDetail.current_user);
      setSecondUser(exchangeDetail.partner);

    }
    // console.log("check step", firstCurrentStage);
    // console.log("check step2", secondCurrentStage);
    setCurrentStepLeft(firstCurrentStage);
    setCurrentStepRight(secondCurrentStage);
  }, [firstCurrentStage, secondCurrentStage]);


  // User avatar component
  const UserAvatar = ({ image, name }) => (
    <div className="flex flex-col items-center mb-6">
      <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-gray-200">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-6 bg-white">
      <h1 className="text-2xl font-bold mb-8 text-center">TIẾN ĐỘ TRAO ĐỔI</h1>

      <div className="flex justify-center items-start w-full max-w-4xl">
        {/* Left user */}
        <div className="flex flex-col items-center mr-4">
          <UserAvatar
            side="left"
            image={firstUser?.avatar_url || "/api/placeholder/100/100"}
            name={firstUser?.full_name || "Bạn"}
          />

          {leftSteps.slice(0, leftSteps.length - 1).map((step, index) =>
            renderStep(step, index, currentStepLeft, 'left')
          )}
        </div>

        {/* Switch button */}
        {/* <div className="flex items-center justify-center my-32">
          <button
            onClick={switchUserFocus}
            className="p-3 bg-black text-white rounded w-12 h-12 flex items-center justify-center"
          >
            <ArrowLeftRight size={24} />
          </button>
        </div> */}

        {/* Right user */}
        <div className="flex flex-col items-center ml-4">
          <UserAvatar
            side="right"
            image={secondUser?.avatar_url || "/api/placeholder/100/100"}
            name={secondUser?.full_name || "Minh"}
          />

          {rightSteps.slice(0, rightSteps.length - 1).map((step, index) =>
            renderStep(step, index, currentStepRight, 'right')
          )}
        </div>
      </div>

      {/* Final common step */}
      <div className="mt-4 flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center
              ${(currentStepLeft === leftSteps.length && currentStepRight === rightSteps.length)
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-400'}`}
        >
          <Check size={20} />
        </div>
        <div className="text-xs text-center mt-1">Hoàn tất trao đổi</div>
      </div>

      {/* Demo controls - hidden in production */}
      {/* <div className="mt-12 flex gap-4">
          <button 
            onClick={() => incrementStep('left')}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Tiến hành bước tiếp (Bạn)
          </button>
          <button 
            onClick={() => incrementStep('right')}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Tiến hành bước tiếp (Minh)
          </button>
        </div> */}
    </div>
  );

}

export default ProgressSection

ProgressSection.propTypes = {
  exchangeData: PropTypes.shape({
    exchange: PropTypes.shape({
      id: PropTypes.number.isRequired,
      depositAmount: PropTypes.number.isRequired,
    }).isRequired,
    initialStage: PropTypes.shape({
      firstUser: PropTypes.number.isRequired,
      secondUser: PropTypes.number.isRequired,
    }).isRequired,
  }),
  exchangeDetail: PropTypes.object,
  firstCurrentStage: PropTypes.number,
  secondCurrentStage: PropTypes.number,
};
