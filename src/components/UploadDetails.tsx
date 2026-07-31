import { motion } from "motion/react";
import type { FocalPoint } from "../lib/faceCrop";
import "./UploadDetails.css";

interface UploadDetailsProps {
  previewUrl: string;
  focalPoint: FocalPoint;
  name: string;
  role: string;
  onNameChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onChangePhoto: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function UploadDetails({
  previewUrl,
  focalPoint,
  name,
  role,
  onNameChange,
  onRoleChange,
  onChangePhoto,
  onSubmit,
  onCancel,
}: UploadDetailsProps) {
  return (
    <motion.div
      className="upload-scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div
        className="upload-details"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
      >
        <button type="button" className="upload-details__back" onClick={onCancel} data-sound="back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M16 10H4M4 10L9 5M4 10L9 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>

        <div className="upload-details__photo-wrap">
          <div className="upload-details__photo">
            <img
              src={previewUrl}
              alt="Your upload"
              style={{ objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%` }}
            />
          </div>
          <button type="button" className="upload-details__change" onClick={onChangePhoto}>
            Change Photo
          </button>
        </div>

        <div className="upload-details__fields">
          <label className="upload-details__field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              maxLength={40}
              placeholder="Nzube Ezudo"
              onChange={(e) => onNameChange(e.target.value)}
            />
          </label>
          <label className="upload-details__field">
            <span>Role</span>
            <input
              type="text"
              value={role}
              maxLength={48}
              placeholder="Lead, SuperteamNG"
              onChange={(e) => onRoleChange(e.target.value)}
            />
          </label>
        </div>

        <button
          type="button"
          className="btn btn-primary upload-details__submit"
          onClick={onSubmit}
          data-sound="select"
          disabled={!name.trim()}
        >
          Generate My Identity
        </button>
      </motion.div>
    </motion.div>
  );
}
