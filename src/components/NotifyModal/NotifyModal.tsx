import { memo, useState } from "react";
import { Trans, t } from "@lingui/macro";

import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useNotifyModalState } from "lib/useNotifyModalState";
import ExternalLink from "components/ExternalLink/ExternalLink";

import "./NotifyModal.scss";

import { ReactComponent as NotifiLogoIcon } from "img/notifi-logo.svg";
import { ReactComponent as ArrowBulletIcon } from "img/arrow-bullet.svg";
import { ReactComponent as ExternalLinkIcon } from "img/external-link.svg";
import Checkbox from "components/Checkbox/Checkbox";

export function NotifyModal() {
  const { notifyModalOpen, setNotifyModalOpen } = useNotifyModalState();
  const [agreeTerms, setAgreeTerms] = useState(false)


  return (
    <Modal isVisible={notifyModalOpen} setIsVisible={setNotifyModalOpen} label={t`Important`}>
      <div className="NotifyModal">
        <div>
          <h1>Welcome to the Aarc GMX Demo!</h1>
          <p className="">
            Aarc revolutionizes cross-chain trading, allowing you to open long/short positions or swap assets across any blockchain, DEX, and using any asset.
            <br></br>
            <br></br>
            <strong>Here's how to get started:</strong>
          </p>
          <ol className="NotifyModal-bullet-list">
            <li>Choose your trading action: Long, Short, or Swap.</li>
            <li>Select your preferred payment asset (any token from supported chains).</li>
            <li>Enter your desired trade amount in the "Pay" field.</li>
            <li>Adjust your leverage using the slider (1x to 50x).</li>
            <li>Review trade details carefully, including fees, potential profit/loss, and liquidation price.</li>
            <li>Click "Deposit" to launch the Aarc Commerce interface for simulated funding.</li>
          </ol>
          <p><strong>Important:</strong></p>
          <p>
            Real deposits from this demo are possible on the mainnet. For your safety, funds will be transferred directly to your wallet instead of the GMX pools. This ensures your assets remain safe as you explore the platform's features.
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
      {/* <div className="NotifyModal">
        <Trans>
          Get alerts and announcements from GMX to stay on top of your trades, liquidation risk, and&nbsp;more.
        </Trans>
        <NotifyBulletList />
        <Button
          variant="primary-action"
          to="https://gmx.notifi.network"
          newTab
          className="NotifyModal-button w-full"
          type="submit"
        >
          <Trans>Continue</Trans>
        </Button>
        <div className="NotifyModal-terms">
          <Trans>
            <span>
              Notifications are provided by Notifi and not affiliated with&nbsp;GMX. By subscribing, you agree that info
              you provide to Notifi will be governed by its{" "}
            </span>
            <ExternalLink href="https://notifi.network/privacy">Privacy Policy</ExternalLink>
            <span> and </span>
            <ExternalLink href="https://notifi.network/terms">Terms of Use</ExternalLink>.
          </Trans>
        </div>
        <div className="NotifyModal-notifi">
          <Trans>Powered by</Trans>
          <NotifiLogoIcon />
        </div>
      </div> */}
    </Modal>
  );
}

const NotifyBulletList = memo(function NotifyBulletList() {
  return (
    <div className="NotifyModal-bullet-list">
      {[
        t`GMX Announcements`,
        t`Trade Confirmations`,
        t`Liquidation Confirmations`,
        t`Governance Alerts`,
        t`Trade Errors`,
        t`Liquidation Risk Alerts`,
        t`Trading Pair Price Alerts`,
      ].map((item, i) => (
        <div key={i} className="NotifyModal-bullet">
          <ArrowBulletIcon />
          <div className="NotifyModal-bullet-text">{item}</div>
        </div>
      ))}
    </div>
  );
});
