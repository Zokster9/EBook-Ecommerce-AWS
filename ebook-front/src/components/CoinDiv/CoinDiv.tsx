import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Container from "react-bootstrap/Container";
import PaypalCheckoutButton from "../PaypalCheckoutButton/PaypalCheckoutButton";

type CoinDivProps = {
  cost: number;
};

const CoinDiv = ({ cost }: CoinDivProps) => {
  return (
    <Container className="border border-primary p-2 d-flex flex-column align-items-center justify-content-center">
      <h2>BUY</h2>
      <h3>
        {cost} <MonetizationOnIcon />
      </h3>
      <div className="w-100">
        <PaypalCheckoutButton cost={cost} />
      </div>
    </Container>
  );
};

export default CoinDiv;
