import { PayPalButtons } from "@paypal/react-paypal-js";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { updateCoinStatus } from "../../services/PaypalService";

type PaypalCheckoutButtonProps = {
  cost: number;
};

const PaypalCheckoutButton = ({ cost }: PaypalCheckoutButtonProps) => {
  const { user, updateUser } = useUser();
  const product = {
    description: `${cost} coins`,
    price: cost.toString(),
  };

  const handleApprove = (orderId: string) => {
    console.log(orderId);
    const coins = +user.coins! + +product.price;
    updateCoinStatus(coins, user.id!)
      .then((_) => {
        toast.success(`You successfully bought ${product.price} coins!`);
        updateUser({
          ...user,
          coins,
        });
      })
      .catch((err: AxiosError<{ message: string }>) => {
        toast.error(err.response?.data.message);
      });
  };
  return (
    <PayPalButtons
      style={{
        color: "silver",
        layout: "horizontal",
        height: 48,
        tagline: false,
        shape: "pill",
      }}
      createOrder={(_, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: product.description,
              amount: {
                value: product.price,
              },
            },
          ],
        });
      }}
      onApprove={async (data, actions) => {
        const order = await actions.order?.capture();
        console.log(order);

        handleApprove(data.orderID);
      }}
    />
  );
};

export default PaypalCheckoutButton;
