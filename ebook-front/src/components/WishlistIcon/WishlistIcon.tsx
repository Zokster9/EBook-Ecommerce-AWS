import FavoriteIcon from "@mui/icons-material/Favorite";

type WishlistIconProps = {
  quantity: number;
};

const WishlistIcon = ({ quantity }: WishlistIconProps) => {
  return (
    <>
      <FavoriteIcon />

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
        {quantity}
      </div>
    </>
  );
};

export default WishlistIcon;
