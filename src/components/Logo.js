import React from 'react';
import Svg, { Path, Polygon, Rect, Text as SvgText, Defs, ClipPath } from 'react-native-svg';

export const BRAND = {
  night:       '#1a1a2e',
  purple:      '#534AB7',
  purpleLight: '#AFA9EC',
  teal:        '#1D9E75',
  tealLight:   '#9FE1CB',
  grey:        '#888780',
};

const TopArrowPath    = 'M 32 10 C 18 10 10 20 10 30 C 10 40 18 44 28 44 L 36 44 C 43 44 48 47 48 53 C 48 59 43 53 36 53 L 20 53';
const TopArrowHead    = '16,48 20,55 24,48';
const BottomArrowPath = 'M 32 54 C 46 54 54 44 54 34 C 54 24 46 20 36 20 L 28 20 C 21 20 16 17 16 11 C 16 5 21 11 28 11 L 44 11';
const BottomArrowHead = '48,16 44,9 40,16';

const SwapArrows = ({ topColor, bottomColor, strokeWidth = 5 }) => (
  <>
    <Path
      d={TopArrowPath}
      fill="none"
      stroke={topColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Polygon points={TopArrowHead} fill={topColor} />
    <Path
      d={BottomArrowPath}
      fill="none"
      stroke={bottomColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Polygon points={BottomArrowHead} fill={bottomColor} />
  </>
);

const FullLogo = ({ scheme, height }) => {
  const CANVAS_W = 280;
  const CANVAS_H = 72;
  const scale    = height / CANVAS_H;
  const width    = CANVAS_W * scale;

  const iconBg    = scheme === 'dark' ? BRAND.night      : '#f0f0f0';
  const topClr    = scheme === 'dark' ? BRAND.purpleLight : BRAND.purple;
  const botClr    = scheme === 'dark' ? BRAND.tealLight   : BRAND.teal;
  const skillsClr = scheme === 'dark' ? '#ffffff'         : BRAND.night;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
      <Defs>
        <ClipPath id="icon-clip-full">
          <Rect x="0" y="0" width="72" height="72" rx="16" />
        </ClipPath>
      </Defs>

      <Rect x="0" y="0" width="72" height="72" rx="16" fill={iconBg} />

      <Svg
        x="0"
        y="0"
        width="72"
        height="72"
        viewBox="0 0 64 64"
        clipPath="url(#icon-clip-full)"
      >
        <SwapArrows topColor={topClr} bottomColor={botClr} strokeWidth={4.5} />
      </Svg>

      <SvgText x="88" y="32" fontFamily="System" fontSize="23" fontWeight="700" fill={skillsClr} letterSpacing="-0.5">
        Skills
      </SvgText>
      <SvgText x="152" y="32" fontFamily="System" fontSize="23" fontWeight="700" fill={BRAND.purple} letterSpacing="-0.5">
        Swap
      </SvgText>

      <SvgText x="88" y="54" fontFamily="System" fontSize="12" fontWeight="400" fill={BRAND.grey} letterSpacing="0.3">
        Trade skills. Grow together.
      </SvgText>
    </Svg>
  );
};

const IconLogo = ({ bg, topColor, bottomColor, size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Rect x="0" y="0" width="64" height="64" rx="14" fill={bg} />
    <SwapArrows topColor={topColor} bottomColor={bottomColor} strokeWidth={5} />
  </Svg>
);

const WordmarkLogo = ({ scheme, height }) => {
  const CANVAS_W  = 175;
  const CANVAS_H  = 32;
  const scale     = height / CANVAS_H;
  const width     = CANVAS_W * scale;
  const skillsClr = scheme === 'dark' ? '#ffffff' : BRAND.night;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
      <SvgText x="0" y="24" fontFamily="System" fontSize="28" fontWeight="700" fill={skillsClr} letterSpacing="-0.5">
        Skills
      </SvgText>
      <SvgText x="88" y="24" fontFamily="System" fontSize="28" fontWeight="700" fill={BRAND.purple} letterSpacing="-0.5">
        Swap
      </SvgText>
    </Svg>
  );
};

const Logo = ({ variant = 'full', scheme = 'dark', size = 48 }) => {
  switch (variant) {
    case 'full':
      return <FullLogo scheme={scheme} height={size} />;

    case 'icon':
      return (
        <IconLogo
          bg={BRAND.night}
          topColor={scheme === 'dark' ? BRAND.purpleLight : BRAND.purple}
          bottomColor={scheme === 'dark' ? BRAND.tealLight : BRAND.teal}
          size={size}
        />
      );

    case 'icon-purple':
      return (
        <IconLogo
          bg={BRAND.purple}
          topColor="#ffffff"
          bottomColor={BRAND.tealLight}
          size={size}
        />
      );

    case 'wordmark':
      return <WordmarkLogo scheme={scheme} height={size} />;

    default:
      return null;
  }
};

export default Logo;