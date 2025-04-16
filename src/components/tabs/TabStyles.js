import styled from 'styled-components';
import { getTextGlow, CyberpunkColors } from '../../styles/themes';

export const TabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const TabsHeader = styled.div`
  display: flex;
  background-color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.darkBlue;
    }
    return props.theme === 'dark' ? '#1e1e1e' : '#f0f0f0';
  }};
  border-bottom: 1px solid ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.borderColor;
    }
    return props.theme === 'dark' ? '#333' : '#ddd';
  }};
  position: relative; /* For absolute positioning of the new tab button */

  /* Add subtle glow to the bottom border for cyberpunk themes */
  ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
    box-shadow: 0 1px 5px ${CyberpunkColors.cyanRGBA(0.2)};
  ` : ''}
`;

export const TabsScroller = styled.div`
  display: flex;
  overflow-x: auto;
  flex-grow: 1;
  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? '#555' : '#ccc'};
    border-radius: 5px;
  }
`;

export const Tab = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background-color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return props.active ? CyberpunkColors.mediumBlue : CyberpunkColors.darkBlue;
    }
    return props.active
      ? (props.theme === 'dark' ? '#2d2d2d' : '#fff')
      : (props.theme === 'dark' ? '#1e1e1e' : '#f0f0f0');
  }};
  color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return props.active ? CyberpunkColors.cyan : CyberpunkColors.lightText;
    }
    return props.active
      ? (props.theme === 'dark' ? '#fff' : '#000')
      : (props.theme === 'dark' ? '#ccc' : '#666');
  }};
  border-right: 1px solid ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return props.active ? CyberpunkColors.cyan : CyberpunkColors.borderColor;
    }
    return props.theme === 'dark' ? '#333' : '#ddd';
  }};
  min-width: 10%;
  max-width: 20%;
  position: relative;
  transition: all 0.2s ease;

  /* Apply glow effect for cyberpunk themes */
  ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') && props.active ? `
    ${getTextGlow(CyberpunkColors.cyanRGBA(), 1)}
    border-bottom: 2px solid ${CyberpunkColors.cyan};
  ` : ''}

  &:hover {
    background-color: ${props => {
      if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
        return CyberpunkColors.mediumBlue;
      }
      return props.theme === 'dark' ? '#3a3a3a' : '#f9f9f9';
    }};
    ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') && !props.active ? `
      ${getTextGlow(CyberpunkColors.cyanRGBA(), 0.5)}
    ` : ''}
  }
`;

export const TabTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

export const CloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 1.5em;
  height: 1.5em;

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#555' : '#ddd'};
  }
`;

export const NewTabButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  cursor: pointer;
  color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.cyan;
    }
    return props.theme === 'dark' ? '#ccc' : '#666';
  }};
  position: sticky;
  right: 0;
  top: 0;
  background-color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.darkBlue;
    }
    return props.theme === 'dark' ? '#1e1e1e' : '#f0f0f0';
  }};
  border-left: 1px solid ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.borderColor;
    }
    return props.theme === 'dark' ? '#333' : '#ddd';
  }};
  z-index: 10;
  box-shadow: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return `-5px 0 10px rgba(0, 0, 30, 0.5), 0 0 5px ${CyberpunkColors.cyanRGBA(0.2)}`;
    }
    return props.theme === 'dark' ? '-5px 0 10px rgba(0, 0, 0, 0.3)' : '-5px 0 10px rgba(0, 0, 0, 0.1)';
  }};
  height: 100%;
  transition: all 0.2s ease;

  /* Apply glow effect for cyberpunk themes */
  ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
    ${getTextGlow(CyberpunkColors.cyanRGBA(), 0.8)}
  ` : ''}

  &:hover {
    background-color: ${props => {
      if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
        return CyberpunkColors.mediumBlue;
      }
      return props.theme === 'dark' ? '#3a3a3a' : '#f9f9f9';
    }};
    ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
      ${getTextGlow(CyberpunkColors.cyanRGBA(), 1)}
    ` : ''}
  }
`;

export const TabContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;
