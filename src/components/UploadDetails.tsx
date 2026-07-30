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
      className="upload-details"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <button type="button" className="upload-details__back" onClick={onCancel}>
        ← Back
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
          Change photo
        </button>
      </div>

      <h2 className="upload-details__title">Add your details</h2>
      <p className="upload-details__subtitle">
        This appears on your "I'm Attending" card.
      </p>

      <div className="upload-details__fields">
        <label className="upload-details__field">
          <span>Name</span>
          <input
            type="text"
            value={name}
            maxLength={40}
            placeholder="e.g. Astral"
            onChange={(e) => onNameChange(e.target.value)}
            autoFocus
          />
        </label>
        <label className="upload-details__field">
          <span>Role</span>
          <input
            type="text"
            value={role}
            maxLength={48}
            placeholder="e.g. Designer, Dacoit"
            onChange={(e) => onRoleChange(e.target.value)}
          />
        </label>
      </div>

      <button
        type="button"
        className="btn btn-primary upload-details__submit"
        onClick={onSubmit}
        disabled={!name.trim()}
      >
        Generate My Identity
      </button>
    </motion.div>
  );
}
