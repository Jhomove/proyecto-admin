import React from 'react';

const stylePaper = {
    cardGrid : {
        paddingTop: 8,
        paddingBottom: 8
    },
    paper: {
        backgroudColor: "#f5f5f5",
        padding: "20px",
        minHeight: 650
    },
    link: {
        display: "flex"
    },
    gridTextfield: {
        marginTop: "20px"
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    cardMedia: {
        paddingTop: "56.25%"
    },
    cardContent: {
        flexGrow: 1
    }
  }

  export const ThemePaper = React.createContext(
      stylePaper
  );