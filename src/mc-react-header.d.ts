declare module "mc-react-header" {
  interface MaterialsCloudHeaderProps {
    activeSection: string;
    breadcrumbsPath: { name: string; link: string | null }[];
    children?: React.ReactNode;
  }

  export default class MaterialsCloudHeader extends React.Component<MaterialsCloudHeaderProps> {}
}
