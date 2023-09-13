import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

type CoinIconProps = {
  quantity: number;
};

const CoinIcon = ({ quantity }: CoinIconProps) => {
  return (
    <>
      <MonetizationOnIcon />

      <div
        className="rounded-circle bg-danger d-flex justify-content-center align-items-center"
        style={{
          color: "white",
          width: "1.5rem",
          height: "1.5rem",
          position: "absolute",
          bottom: 0,
          right: 0,
          transform: "translate(25%, 25%)",
        }}
      >
        {quantity.toFixed(2)}
      </div>
    </>
  );
};

export default CoinIcon;
