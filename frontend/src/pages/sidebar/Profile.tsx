import React, { useState, useEffect } from "react";
import UserDetails from "../../components/UserDetails";
import StaffDetails from "../../components/StaffDetails";
import { Button, Box } from "@mui/material";
import db from "../../components/db";
import { UserData } from "../../models/profile.model";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    db.get("/view/user")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    db.put("/edit/user", userData)
      .then((response) => {
        console.log("User data updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => {
      if (prevData) {
        return { ...prevData, [name]: value };
      }
      return null;
    });
  };

  return (
    <Box>
      {userData && (
        <>
          <UserDetails
            userData={userData}
            isEditing={isEditing}
            handleChange={handleChange}
          />
          {userData.staffInfo && (
            <StaffDetails staffInfo={userData.staffInfo} isEditing={false} />
          )}
          <Box sx={{ mt: 2 }}>
            {isEditing ? (
              <Button
                onClick={handleSave}
                variant="contained"
                color="success"
                sx={{ mr: 2 }}
              >
                Save
              </Button>
            ) : (
              <Button
                onClick={handleEdit}
                variant="contained"
                color="info"
                sx={{ mr: 2 }}
              >
                Edit
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Profile;
