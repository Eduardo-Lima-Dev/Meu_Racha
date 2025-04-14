import { SkeletonTheme } from 'react-loading-skeleton';

export const CustomSkeletonTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SkeletonTheme
      baseColor="#2d2d2d"
      highlightColor="#3d3d3d"
    >
      {children}
    </SkeletonTheme>
  );
};