import { useContext } from "react";
import { Link } from "react-router-dom";

import { ssspVersion } from "@sssp";
import { Citation } from "@sssp/components";
import { PseudoContext } from "@sssp/context";

import styles from "./CitationPage.module.scss";

const CitationPage: React.FC = () => {
  const {
    verificationMetadata,
    libraryMetadata,
    methodsMetadata,
    pseudosMetadata,
  } = useContext(PseudoContext);

  return (
    <div id={styles.citationPage}>
      <header className="page-title">
        <h1 className="display-6">How to cite the SSSP libraries</h1>
      </header>

      <main>
        <section id={styles.citationSection}>
          If you use the SSSP libraries in your work, please:
          <ul>
            <li>
              In the main text, refer to the library as{" "}
              <code>SSSP [xc] [acc] [version]</code>, where
              <ul>
                <li>
                  <code>[xc]</code> is the functional (e.g., PBE, PBEsol)
                </li>
                <li>
                  <code>[acc]</code> is the SSSP library variant (e.g.,
                  Efficiency, Precision)
                </li>
                <li>
                  <code>[version]</code> is the SSSP version (e.g., v
                  {ssspVersion})
                </li>
              </ul>
              For example: "SSSP PBEsol Precision v{ssspVersion}"
            </li>
            <li>
              In addition, also cite the SSSP paper and website:
              <ul>
                <li>
                  G. Prandini, A. Marrazzo, I. E. Castelli, N. Mounet and N.
                  Marzari,{" "}
                  <a
                    href="https://www.nature.com/articles/s41524-018-0127-2"
                    target="_blank"
                  >
                    <em>npj Comp. Mater.</em> <b>4</b>, 72
                  </a>{" "}
                  (2018).
                </li>
                <li>
                  <a href="http://materialscloud.org/sssp" target="_blank">
                    http://materialscloud.org/sssp
                  </a>
                </li>
              </ul>
            </li>
            <li>
              If using BibTex, use:
              <pre>
                {`@article{
    prandini2018precision,
    title={Precision and efficiency in solid-state pseudopotential calculations},
    author={Prandini, Gianluca and Marrazzo, Antimo and Castelli, Ivano E and Mounet, Nicolas and Marzari, Nicola},
    journal={npj Comp. Mater.},
    volume={4},
    number={1},
    pages={72},
    year={2018},
    issn = {2057-3960},
    url = {https://www.nature.com/articles/s41524-018-0127-2},
    doi = {10.1038/s41524-018-0127-2},
    note = {\\href{http://materialscloud.org/sssp}{http://materialscloud.org/sssp}},
    publisher={Nature Publishing Group UK London}
}`}
              </pre>
            </li>
          </ul>
        </section>

        <section id={styles.verificationSection}>
          <h2>Verification</h2>
          <ul>
            {Object.entries(verificationMetadata).map(
              ([citationKey, citation]) => (
                <li key={citationKey}>
                  <Citation label={citationKey} citation={citation.citation} />
                </li>
              ),
            )}
          </ul>
        </section>

        <section id={styles.librariesSection}>
          <h2>Libraries</h2>
          <ul>
            {Object.entries(libraryMetadata).map(([libraryKey, library]) => (
              <li key={libraryKey}>
                <Citation
                  label={libraryKey}
                  website={library.website}
                  citation={library.citation}
                  license={library.license}
                  versions={library.versions?.map((version) => {
                    const versionMetadata = pseudosMetadata[version];
                    return {
                      name: versionMetadata.displayName,
                      content: versionMetadata.description
                        ? versionMetadata.description
                        : undefined,
                    };
                  })}
                />
              </li>
            ))}
          </ul>
        </section>

        <section id={styles.methodsSection}>
          <h2>Methods</h2>
          <ul>
            {Object.entries(methodsMetadata).map(([methodKey, method]) => (
              <li key={methodKey}>
                <Citation
                  label={methodKey}
                  website={method.website}
                  citation={method.citation}
                />
              </li>
            ))}
          </ul>
        </section>

        <hr />

        <p>
          Please <Link to="/contact">contact us</Link> if you think we should
          add more citations to the list above, if any of the information is
          incorrect, or if you have any questions about how to cite the SSSP
          libraries.
        </p>
      </main>
    </div>
  );
};

export default CitationPage;
