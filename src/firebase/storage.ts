import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

export async function uploadRiskAttachment(
  riskId: string,
  file: File
): Promise<string> {
  const path = `risks/${riskId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
