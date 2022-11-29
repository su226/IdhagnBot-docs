import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { mdiAccount, mdiAccountSupervisor, mdiApplicationBracesOutline } from "@mdi/js";
import Admonition from "@theme/Admonition";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import MdiIcon from "../components/MdiIcon";
import styles from "./index.module.css";

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--outline button--lg"
            to="https://github.com/su226/IdhagnBot">
            GitHub
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/guide">
            指南
          </Link>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  svg?: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "多处服务",
    description: (
      <>
        IdhagnBot 设计之处就考虑到同时服务多个群，并为此设计了完善的配置、权限、帮助等系统。
      </>
    ),
  },
  {
    title: "代码整洁™",
    description: (
      <>
        作者非常强迫症，优先使用 Pillow 等库而非浏览器渲染，并且尽可能少引入依赖。<small>不过作者的编码风格非常狂野，写出了不少💩山。</small>
      </>
    ),
  },
  {
    title: "随缘更新",
    description: (
      <>
        作者有薛定谔的生产力，有时更新得不可思议地快，有时又会拖更很久，并且时常写了代码记不得 commit 和 push。
      </>
    ),
  },
  {
    title: "缝合怪",
    description: (
      <>
        IdhagnBot <del>缝</del>整合了多个 Nonebot 插件，如
        <Link to="https://github.com/noneplugin/nonebot-plugin-petpet">nonebot-plugin-petpet</Link>
      </>
    ),
  },
  {
    title: "不会卖萌",
    description: (
      <>
        由于作者强烈的直男思维，IdhagnBot 几乎不会卖萌。（否则作者会尴尬得抠出三室一厅）
      </>
    ),
  },
  {
    title: "Furry",
    description: (
      <>
        内含一些 Furry 要素，事实上 IdhagnBot 就是使用<Link to="https://su226.tk/2021/07/24/my-fursona/">作者的兽设</Link>命名的。
      </>
    ),
  },
];

function Feature({title, svg: Svg, description}: FeatureItem) {
  return (
    <div className={"col col--4"}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageMain(): JSX.Element {
  return (
    <main className={clsx("container", styles.main)}>
      <Admonition type="caution">
        文档还在施工中，目前仅供先行预览。
      </Admonition>
      <section className="row">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </section>
      <hr/>
      <section className={styles.usages}>
        <h2>快速入门</h2>
        <div className={styles.usage}>
          <h3><MdiIcon path={mdiAccount} />我是用户</h3>
          <p>
            体验 IdhagnBot 最简单的方法是加入<Link to="https://qm.qq.com/cgi-bin/qm/qr?k=USDC9Yc0PPxBHHIVp5KIoHYSmuBHJK2u">作者的闲聊群</Link>，没有话题限制，并且作者也很好说话。<br />
            当然，请不要讨论政治等敏感或令人不快的话题。
          </p>
        </div>
        <div className={styles.usage}>
          <h3><MdiIcon path={mdiAccountSupervisor} />我是群主</h3>
          <p>
            你可以参考<Link to="/docs/guide">文档</Link>学习如何安装和配置 IdhagnBot。<br />
            <del>如果和作者关系足够好的话，你也可以让作者托管在他自己的（并不是非常稳定的）电脑上。</del>
          </p>
        </div>
        <div className={styles.usage}>
          <h3><MdiIcon path={mdiApplicationBracesOutline} />我是开发者</h3>
          <p>
            由于作者长期单打独斗，IdhagnBot 的 API 时常变动，不过你依然可以发起 Issue 或者 PR。<br />
            建议加入群里交流，以防不必要的麻烦。（目前人数较少，因此没有单独的开发群）
          </p>
        </div>
      </section>
    </main>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout>
      <HomepageHeader />
      <HomepageMain />
    </Layout>
  );
}
