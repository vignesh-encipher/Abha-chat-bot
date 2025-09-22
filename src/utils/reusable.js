import Image from "next/image";

export const renderUserProfile = (data, columnItem) => {
  const compareObj = data[columnItem?.actualField];

  if (
    compareObj?.firstName ||
    compareObj?.lastName ||
    compareObj?.profileImage
  ) {
    return (
      <div
        className="d-flex align-items-center text-truncate"
        style={{ width: "100%", margin: "auto" }}
      >
        <span style={{ marginRight: "10px" }}>
          {renderUserPrfoileAvatar(
            compareObj?.firstName || compareObj?.firstName,
            compareObj?.lastName || compareObj?.lastName,
            compareObj?.profileImage || compareObj?.profileImage,
            "header"
          )}
        </span>
        <span>
          {compareObj?.firstName || compareObj?.firstName}{" "}
          {compareObj?.lastName || compareObj?.lastName}
        </span>
      </div>
    );
  }
  return <div style={{ textAlign: "center" }}>---</div>;
};

export const getBackgroundColor = (randomNumber) => {
  switch (randomNumber) {
    case 1:
      return "#F28585";
    case 2:
      return "#04306F";
    case 3:
      return "#E6A4B4";
    case 4:
      return "#558e95";
    case 5:
      return "#DED0B6";
    case 6:
      return "#C3E2C2";
    default:
      return "#9BB8CD";
  }
};

export const renderUserPrfoileAvatar = (
  firstName,
  lastName,
  imageUrl,
  field,
  customBg
) => {
  const firstNameInitial = firstName?.charAt(0) || "";
  const secondNameInitial = lastName?.charAt(0) || "";
  const hash = (firstNameInitial.charCodeAt(0) % 6) + 1;
  const backgroundColor = customBg
    ? "#93BEFB"
    : field
    ? getBackgroundColor(hash)
    : "#F3C217";

  if (!imageUrl) {
    const profileAvatar = (
      <Avatar
        style={{
          backgroundColor: backgroundColor,
          color: customBg ? "black" : "white",
          cursor: "pointer",
          width: "30px",
          height: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: customBg ? "14px" : "15px",
          fontWeight: 500,
        }}
      >
        {firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase()}
      </Avatar>
    );
    return profileAvatar;
  } else {
    const profileAvatar = (
      <Image
        src={imageUrl}
        alt="avatar"
        width={30}
        height={30}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        }}
        priority
        fetchPriority="high"
      />
    );
    return profileAvatar;
  }
};