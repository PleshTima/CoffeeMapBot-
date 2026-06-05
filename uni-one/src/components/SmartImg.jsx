import { useState } from "react";

// <img> с градиентной заглушкой, если картинка не загрузилась (офлайн).
export default function SmartImg({ src, alt = "", className = "", ...rest }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <div className={`ph ${className}`} {...rest} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
