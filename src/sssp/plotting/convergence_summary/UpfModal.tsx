import { useContext, useEffect, useMemo, useState } from "react";

import { Button, Modal } from "react-bootstrap";

import { API_URL } from "@sssp/common/config";
import LoadingSpinner from "@sssp/components/Spinner";
import { PseudoContext } from "@sssp/context";
import { SsspDataService } from "@sssp/services";
import { BsDownload } from "react-icons/bs";
import { UpfModalProps } from "./UpfModal.models";
import styles from "./UpfModal.module.scss";

const UpfModal: React.FC<UpfModalProps> = ({
  show,
  element,
  pseudoName,
  Z,
  onHide,
}) => {
  const { getUpfUuid, getPseudoFilename } = useContext(PseudoContext);
  const [content, setContent] = useState("");
  const [resolvedFilename, setResolvedFilename] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBackendConfigured = Boolean(API_URL);

  const uuid = useMemo(() => {
    if (!element || !pseudoName || Z === undefined) return "";
    return getUpfUuid(element, pseudoName, Z);
  }, [element, pseudoName, Z, getUpfUuid]);

  const mappedFilename = useMemo(() => {
    if (!element || !pseudoName || Z === undefined) return "";
    return getPseudoFilename(element, pseudoName, Z);
  }, [element, pseudoName, Z, getPseudoFilename]);

  useEffect(() => {
    if (!show) return;
    setError(null);
    setContent("");
    setLoadingContent(false);
    setDownloading(false);
    setResolvedFilename(mappedFilename || "");
  }, [show, element, pseudoName, Z, mappedFilename]);

  const loadUpfContent = async () => {
    setError(null);

    if (!isBackendConfigured) {
      setError("UPF viewer is unavailable (VITE_API_URL is not set)");
      return;
    }

    if (!pseudoName || Z === undefined) {
      setError("No pseudopotential selected");
      return;
    }

    if (!uuid) {
      setError("No UPF UUID found for this pseudopotential");
      return;
    }

    setLoadingContent(true);
    try {
      const { filename, content } = await SsspDataService.fetchUpfFile(uuid);
      setResolvedFilename((current) => current || filename);
      setContent(content);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Failed to load UPF file");
      }
    } finally {
      setLoadingContent(false);
    }
  };

  const downloadUpf = async () => {
    setError(null);

    if (!isBackendConfigured) {
      setError("UPF download is unavailable (VITE_API_URL is not set)");
      return;
    }

    if (!uuid) {
      setError("No UPF UUID found for this pseudopotential");
      return;
    }

    setDownloading(true);
    try {
      const { filename: repoFilename, blob } =
        await SsspDataService.fetchUpfBlob(uuid);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const fallback = `${element}-${pseudoName || "pseudo"}${
        Z !== undefined ? `-Z${Z}` : ""
      }.upf`;
      a.download = resolvedFilename || repoFilename || fallback;

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof Error) {
        setError(error?.message || "Failed to download UPF file");
      }
    } finally {
      setDownloading(false);
    }
  };

  const disableActions = !isBackendConfigured || !uuid;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          {element} (Z<sub>val</sub> = {Z}) {pseudoName}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.modalBody}>
        {error ? (
          <div className={styles.message}>{error}</div>
        ) : loadingContent ? (
          <LoadingSpinner />
        ) : !content ? (
          !isBackendConfigured ? (
            <div className={styles.message}>
              Backend not configured. UPF download/viewing is unavailable.
            </div>
          ) : !uuid ? (
            <div className={styles.message}>
              No UPF UUID found for this pseudopotential.
            </div>
          ) : (
            <div className={styles.loadContainer}>
              <Button variant="primary" onClick={loadUpfContent}>
                Load UPF content
              </Button>
              <div className={styles.hint}>May take some time</div>
            </div>
          )
        ) : (
          <div className={styles.content}>
            <pre className={styles.pre}>{content}</pre>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="justify-content-start">
        <Button
          id={styles.downloadUpfButton}
          variant="primary"
          onClick={downloadUpf}
          disabled={disableActions || downloading}
        >
          <span id={styles.downloadUpfText}>Download UPF file</span>
          {downloading ? (
            <div
              className="spinner-border spinner-border-sm text-light"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <BsDownload />
          )}
        </Button>
        <span id={styles.filename}>{resolvedFilename}</span>
      </Modal.Footer>
    </Modal>
  );
};

export default UpfModal;
