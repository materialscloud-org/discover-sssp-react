import styles from "./ContactPage.module.scss";

const ContactPage: React.FC = () => (
  <div id={styles.contactPage}>
    <header className="page-title">
      <h1 className="display-6">Contact us</h1>
    </header>

    <main>
      <p>
        For any questions, suggestions, or issues regarding the SSSP libraries,
        please contact:
      </p>
      <ul>
        <li>
          <a
            href="https://ethz.ch/staffnet/de/organisation/abteilungen/informatikdienste/personen/person-detail.Mzc2MTQ0.TGlzdC8zODgsLTg1MzU3NzMxNA==.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jusong Yu
          </a>
        </li>
        <li>
          <a
            href="https://www.psi.ch/en/lms/people/michail-minotakis"
            target="_blank"
            rel="noopener noreferrer"
          >
            Michail Minotakis
          </a>
        </li>
        <li>
          <a
            href="https://www.psi.ch/en/lms/people/edan-bainglass"
            target="_blank"
            rel="noopener noreferrer"
          >
            Edan Bainglass
          </a>{" "}
          (SSSP app developer)
        </li>
        <li>
          <a
            href="https://www.psi.ch/en/lms/people/timo-reents"
            target="_blank"
            rel="noopener noreferrer"
          >
            Timo Reents
          </a>
        </li>
        <li>
          <a
            href="https://www.phy.cam.ac.uk/profile/prof-nicola-marzari/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nicola Marzari
          </a>
        </li>
        <li>
          <a
            href="https://www.psi.ch/en/lms/people/giovanni-pizzi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Giovanni Pizzi
          </a>
        </li>
      </ul>
      <p>
        For reporting bugs or issues with the SSSP app, please open an issue on
        the{" "}
        <a
          href="https://github.com/materialscloud-org/discover-sssp-react/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </a>
        .
      </p>
    </main>
  </div>
);

export default ContactPage;
