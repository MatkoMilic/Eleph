//ZA IPHONE, NE RADI ZA ANDROID:

import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

class UserPermissions {
  getCameraPermission = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status != "granted") {
        alert("Permission to use your camera roll is needed.");
      }
    }
  };
}

export default new UserPermissions();
