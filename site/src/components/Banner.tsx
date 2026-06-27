import { useEffect, useRef, useState } from "react";
import { bannerSlides } from "../data/site";

const INTERVALO = 6500;

export function Banner() {
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = bannerSlides.length;
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || pausado) return;

    timer.current = window.setTimeout(() => {
      setAtivo((i) => (i + 1) % total);
    }, INTERVALO);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [ativo, pausado, total]);

  return (
    <aside
      className="banner"
      aria-label="Avisos do posto"
      aria-roledescription="carrossel"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      <div className="banner__inner">
        <div className="banner__palco">
          {bannerSlides.map((slide, i) => (
            <div
              key={slide.id}
              className={`banner__slide ${i === ativo ? "is-ativo" : ""}`}
              aria-hidden={i !== ativo}
            >
              <span
                className={`banner__tag ${
                  "futuro" in slide && slide.futuro ? "banner__tag--futuro" : ""
                }`}
              >
                {slide.tag}
              </span>
              <p className="banner__texto">{slide.texto}</p>
            </div>
          ))}
        </div>

        <div className="banner__dots" role="tablist" aria-label="Selecionar aviso">
          {bannerSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === ativo}
              aria-label={`Aviso ${i + 1} de ${total}`}
              className={`banner__dot ${i === ativo ? "is-ativo" : ""}`}
              onClick={() => setAtivo(i)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
