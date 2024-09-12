import { useState } from "react";
import { Trans, t } from "@lingui/macro";

import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useNotifyModalState } from "lib/useNotifyModalState";

import "./NotifyModal.scss";

import Checkbox from "components/Checkbox/Checkbox";

export function NotifyModal() {
  const { notifyModalOpen, setNotifyModalOpen } = useNotifyModalState();
  const [agreeTerms, setAgreeTerms] = useState(false)


  return (
    <Modal isVisible={notifyModalOpen} setIsVisible={setNotifyModalOpen} label={`Important`}>
      <div className="NotifyModal">
        <div>
          <h1>Welcome to the Aarc GMX Demo!</h1>
          <p>
            Aarc allows you to use any token from anywhere. With this demo, you can open long/short positions or swap assets across any blockchain or centralized exchange (CEX) and utilize any asset.
          </p>
          <p><strong>Here's how to get started:</strong></p>
          <ol className="NotifyModal-bullet-list">
            <li>Connect your wallet (e.g., MetaMask) and switch to Arbitrum Mainnet if needed.</li>
            <li>Choose your trading action: Long, Short, or Swap.</li>
            <li>Select your preferred payment asset from the list of supported tokens.</li>
            <li>Enter your desired trade amount in the "Pay" field.</li>
            <li>Review trade details carefully. Adjust your leverage using the slider (1x to 50x).</li>
            <li>Click "Deposit" to launch the Aarc interface for funding.</li>
          </ol>
          <p><strong>Important:</strong></p>
          <p>
            This demo works on Mainnets with real money. For your safety, all funds you deposit will be transferred directly and only to your wallet address, not to GMX. This ensures your assets remain safe as you explore the platform.
          </p>
          <div className="agree-checkbox">
            <Checkbox isChecked={agreeTerms} setIsChecked={setAgreeTerms} />
            I have read and agree to all the guidelines outlined above.
          </div>
        </div>
        <Button
          variant="primary-action"
          onClick={() => setNotifyModalOpen(false)}
          newTab
          className="NotifyModal-button w-full"
          type="submit"
          disabled={!agreeTerms}
        >
          <Trans>Continue</Trans>
        </Button>
      </div>
    </Modal>
  );
}
