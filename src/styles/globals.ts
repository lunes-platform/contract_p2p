import { createGlobalStyle, css } from 'styled-components'

export default createGlobalStyle`
${({ theme }) => css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Bahnschrift, sans-serif;
    scroll-behavior: smooth;
  }

  body {
    height: 100%;
    text-rendering: optimizelegibility !important;
    -webkit-font-smoothing: antialiased !important;
  }

  html {
    font-size: 90.5%;
  }

  html,
  body,
  #__next {
    height: 100%;
    overflow-x: hidden;
    color: #000000;
    background: #f9f9f9;
  }

  button {
    cursor: pointer;
    border: none;
    white-space: nowrap;
    :hover {
      filter: brightness(0.9);
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    display: block;
  }
  /* width */
  /* ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  } */
  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 50px;
    background: '#e6e6e6';
  }
  .slick-dots li {
    margin: 0 15px;
  }
`}
`
