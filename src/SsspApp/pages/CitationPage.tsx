import { Link } from "react-router-dom";

import { ssspVersion } from "@sssp";
import { Citation } from "@sssp/components";

import styles from "./CitationPage.module.scss";

const CitationPage: React.FC = () => (
  <div id={styles.citationPage}>
    <header className="page-title">
      <h1 className="display-6">How to cite the SSSP libraries</h1>
    </header>

    <main>
      <section>
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
                <code>[version]</code> is the SSSP version (e.g., v{ssspVersion}
                )
              </li>
            </ul>
            For example: "SSSP PBEsol Precision v{ssspVersion}"
          </li>
          <li>
            In addition, also cite the SSSP paper and website:
            <ul>
              <li>
                G. Prandini, A. Marrazzo, I. E. Castelli, N. Mounet and N.
                Marzari, npj Computational Materials 4, 72 (2018)
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
    journal={npj Computational Materials},
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

      <section>
        <h4>Verification</h4>
        <ul>
          <li>
            <em>placeholder for SSSP v2 paper</em>
          </li>
          <li>
            E. Bosoni et al.,{" "}
            <a
              href="https://www.nature.com/articles/s42254-023-00655-3"
              target="_blank"
            >
              <em>Nat. Rev. Phys. 6, 45-58</em>
            </a>
            (2024).
          </li>
          <li>
            SSSP: G. Prandini, A. Marrazzo, I. E. Castelli, N. Mounet and N.
            Marzari,{" "}
            <a
              href="https://www.nature.com/articles/s41524-018-0127-2"
              target="_blank"
            >
              <em>npj Computational Materials 4, 72</em>
            </a>{" "}
            (2018).
          </li>
          <li>
            K. Lejaeghere et al.,{" "}
            <a
              href="http://science.sciencemag.org/content/351/6280/aad3000"
              target="_blank"
            >
              <em>Science 351 (6280), 1415</em>
            </a>{" "}
            (2016). An open-access copy is available from{" "}
            <a href="http://molmod.ugent.be/deltacodesdft" target="_blank">
              Cottenier's page
            </a>
            .
          </li>
        </ul>
      </section>

      <section>
        <h4>Libraries</h4>
        <ul>
          <li>
            <Citation
              label="GBRV"
              link="https://www.physics.rutgers.edu/gbrv/"
              content={
                <span>
                  K. F. Garrity, J. W. Bennett, K. M. Rabe, and D. Vanderbilt,{" "}
                  <a
                    href="http://dx.doi.org/10.1016/j.commatsci.2013.08.053"
                    target="_blank"
                  >
                    <em>Comput. Mater. Sci.</em>
                    <b>81</b>, 446
                  </a>{" "}
                  (2014).
                </span>
              }
              license="GNU General Public License (version 3)"
              versions={[
                {
                  name: "us-gbrv-v1.x-upf2",
                  content: (
                    <span>
                      GBRV v1.x pseudopotentials; UPF files generated with the
                      conversion from K. Laasonen et al.,{" "}
                      <a
                        href="https://doi.org/10.1103/PhysRevB.47.10142"
                        target="_blank"
                      >
                        <em>Phys. Rev. B</em> <b>47</b>, 10142
                      </a>{" "}
                      (1993).
                    </span>
                  ),
                },
              ]}
            />
          </li>
          <li>
            <Citation
              label="SG15"
              link="http://www.quantum-simulation.org/potentials/sg15_oncv"
              content={
                <span>
                  M. Schlipf and F. Gygi,{" "}
                  <a
                    href="http://dx.doi.org/10.1016/j.cpc.2015.05.011"
                    target="_blank"
                  >
                    <em>Comp. Phys. Comm.</em> <b>196</b>, 36
                  </a>{" "}
                  (2015).
                </span>
              }
              license="Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)"
              versions={[
                {
                  name: "nc-sg15-oncvpsp4",
                },
              ]}
            />
          </li>
          <li>
            <Citation
              label="SPMS"
              content={
                <span>
                  Soft and transferable pseudopotentials from multi-objective
                  optimization; M. F. Shojaei, J. E. Pask, A. J. Medford, P.
                  Suryanarayana,{" "}
                  <a
                    href="https://www.sciencedirect.com/science/article/pii/S0010465522003137"
                    target="_blank"
                  >
                    <em>Comput. Mater. Sci.</em> <b>226</b>, 39
                  </a>{" "}
                  (2022).
                </span>
              }
              versions={[
                {
                  name: "nc-spms-oncvpsp4",
                },
              ]}
            />
          </li>
          <li>
            <Citation
              label="Goedecker"
              content={
                <span>
                  A. Willand, Y. O. Kvashnin, L. Genovese, A.
                  Vázquez-Mayagoitia, A. K. Deb, A. Sadeghi, T. Deutsch, and S.
                  Goedecker,{" "}
                  <a href="http://dx.doi.org/10.1063/1.4793260" target="_blank">
                    <em>J. Chem. Phys.</em> <b>138</b>, 104109
                  </a>{" "}
                  (2013).
                </span>
              }
              license="Creative Commons Attribution 3.0 Unported License (CC BY 3.0)"
            />
          </li>
          <li>
            <Citation
              label="Pslibrary 0.3.1"
              link="https://dalcorso.github.io/pslibrary"
              content={
                <span>
                  E. Küçükbenli et al.,{" "}
                  <a href="http://arxiv.org/abs/1404.3015" target="_blank">
                    arXiv:1404.3015
                  </a>{" "}
                  (2014).
                </span>
              }
              license="GNU General Public License (version 2 or later)"
              versions={[
                {
                  name: "us-psl-v0.x",
                },
                {
                  name: "paw-psl-v0.x",
                },
              ]}
            />
          </li>
          <li>
            <Citation
              label="Pslibrary 1.0.0"
              link="https://dalcorso.github.io/pslibrary"
              content={
                <span>
                  A. Dal Corso,{" "}
                  <a
                    href="http://dx.doi.org/10.1016/j.commatsci.2014.07.043"
                    target="_blank"
                  >
                    <em>Comput. Mater. Sci.</em> <b>95</b>, 337
                  </a>{" "}
                  (2014).
                </span>
              }
              license="GNU General Public License (version 2 or later)"
              versions={[
                {
                  name: "us-psl-v1.0.0-high",
                  content: (
                    <span>
                      Ultrasoft pseudopotentials, "high" version (highest number
                      of semicore states and smaller cut-off radii)
                    </span>
                  ),
                },
                {
                  name: "us-psl-v1.0.0-low",
                  content: (
                    <span>
                      Ultrasoft pseudopotentials, "low" version (optimized for
                      low kinetic energy cut-offs at the price of a lower
                      accuracy)
                    </span>
                  ),
                },
                {
                  name: "paw-psl-v1.0.0-high",
                  content: (
                    <span>
                      PAW pseudopotentials, "high" version (highest number of
                      semicore states and smaller cut-off radii)
                    </span>
                  ),
                },
                {
                  name: "paw-psl-v1.0.0-low",
                  content: (
                    <span>
                      PAW pseudopotentials, "low" version (optimized for low
                      kinetic energy cut-offs at the price of a lower accuracy)
                    </span>
                  ),
                },
              ]}
            />
          </li>
          <li>
            <Citation
              label="RE Wentzcovitch"
              link="http://www.mineralscloud.com/resources/repaw/index.shtml"
              content={
                <span>
                  M. Topsakal and R. M. Wentzcovitch,{" "}
                  <a
                    href="http://dx.doi.org/10.1016/j.commatsci.2014.07.030"
                    target="_blank"
                  >
                    <em>Comput. Mater. Sci.</em> <b>95</b>, 263
                  </a>{" "}
                  (2014).
                </span>
              }
              versions={[
                {
                  name: "paw-lanthanides-wentzcovitch",
                },
              ]}
            />
          </li>
          <li>
            <Citation
              label="Pseudo Dojo"
              link="http://www.pseudo-dojo.org/"
              content={
                <span>
                  M.J. van Setten, M. Giantomassi, E. Bousquet, M.J. Verstraete,
                  D.R. Hamann, X. Gonze, G.-M. Rignanese,{" "}
                  <a
                    href="https://doi.org/10.1016/j.cpc.2018.01.012"
                    target="_blank"
                  >
                    <em>Comp. Phys. Comm.</em> <b>226</b>, 39
                  </a>{" "}
                  (2018).
                </span>
              }
              license="GNU Lesser General Public License (version 3.1 or later)"
              versions={[
                {
                  name: "nc-dojo-v0.4.1-std",
                },
                {
                  name: "nc-dojo-v0.4.1-str",
                },
                {
                  name: "nc-dojo-v0.5.0-std",
                },
              ]}
            />
          </li>
          <li>
            <Citation
              label="Actinides MalteSachs"
              content={
                <span>
                  Malte Sachs, Sergei I. Ivlev, Martin Etter, Matthias Conrad,
                  Antti J. Karttunen and Florian Kraus,{" "}
                  <a
                    href="https://doi.org/10.1021/acs.inorgchem.1c02578"
                    target="_blank"
                  >
                    <em>Inorg. Chem.</em> <b>60</b>, 21, 16686-16699
                  </a>{" "}
                  (2021).
                </span>
              }
              versions={[
                {
                  name: "paw-actinides-marburg",
                },
              ]}
            />
          </li>
        </ul>
      </section>

      <section>
        <h4>Methods</h4>
        <ul>
          <li>
            <Citation
              label="Ultrasoft pseudopotentials"
              link="https://www.physics.rutgers.edu/~dhv/uspp/"
              content={
                <span>
                  D. Vanderbilt,{" "}
                  <a
                    href="http://journals.aps.org/prb/abstract/10.1103/PhysRevB.41.7892"
                    target="_blank"
                  >
                    <em>Phys. Rev. B</em> <b>41</b>, 7892(R)
                  </a>{" "}
                  (1990).
                </span>
              }
            />
          </li>
          <li>
            <Citation
              label="Projector-augmented wave (PAW)"
              content={
                <span>
                  P. E. Blöchl,{" "}
                  <a
                    href="http://journals.aps.org/prb/abstract/10.1103/PhysRevB.50.17953"
                    target="_blank"
                  >
                    <em>Phys. Rev. B</em> <b>50</b>, 17953
                  </a>{" "}
                  (1994).
                </span>
              }
            />
          </li>
          <li>
            <Citation
              label="Norm-conserving, multiple projectors pseudopotentials"
              link="http://www.mat-simresearch.com"
              content={
                <span>
                  D. R. Hamann,{" "}
                  <a
                    href="http://journals.aps.org/prb/abstract/10.1103/PhysRevB.88.085117"
                    target="_blank"
                  >
                    <em>Phys. Rev. B</em> <b>88</b>, 085117
                  </a>{" "}
                  (2013).
                </span>
              }
            />
          </li>
          <li>
            <Citation
              label="Separable dual-space Gaussian pseudopotentials"
              link="http://cp2k.web.psi.ch/potentials"
              content={
                <span>
                  S. Goedecker, M. Teter, J. Hutter,{" "}
                  <a
                    href="http://journals.aps.org/prb/abstract/10.1103/PhysRevB.54.1703"
                    target="_blank"
                  >
                    <em>Phys. Rev. B</em> <b>54</b>, 1703
                  </a>{" "}
                  (1996).
                </span>
              }
            />
          </li>
          <li>
            Car-Parrinello molecular dynamics with Vanderbilt ultrasoft
            pseudopotentials
          </li>
        </ul>
      </section>

      <hr />

      <p>
        Please <Link to="/contact">contact us</Link> if you think we should add
        more citations to the list above, if any of the information is
        incorrect, or if you have any questions about how to cite the SSSP
        libraries.
      </p>
    </main>
  </div>
);

export default CitationPage;
