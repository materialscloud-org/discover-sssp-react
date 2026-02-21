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
          <a href="mailto:giovanni.pizzi@psi.ch">Giovanni Pizzi</a>
        </li>
        <li>
          <a href="mailto:jusong.yu@ethz.ch">Jusong Yu</a>
        </li>
        <li>
          <a href="mailto:michail.minotakis@psi.ch">Michail Minotakis</a>
        </li>
        <li>
          <a href="mailto:timo.reents@psi.ch">Timo Reents</a>
        </li>
        <li>
          <a href="mailto:nicola.marzari@psi.ch">Nicola Marzari</a>
        </li>
        <li>
          <a href="mailto:edan.bainglass@psi.ch">Edan Bainglass</a> (SSSP app
          developer)
        </li>
      </ul>
      <p>
        For reporting bugs or issues with the SSSP app, please open an issue on
        the{" "}
        <a
          href="https://github.com/materialscloud-org/discover-sssp-react/issues"
          target="_blank"
        >
          GitHub repository
        </a>
        .
      </p>
    </main>
  </div>
);

export default ContactPage;
