const styles = {

	sidebarHeader: {
		position: "absolute",
		top: "0px",
		marginTop: "17px",
		padding: "10px",
		background: "transparent"
	},
	sidebarFooter: {
		position: "absolute",
		bottom: "0px",
		marginTop: "17px",
    padding: "10px",
		background: "transparent"
	},
	sidebarTitles: {
		margin: "0px",
    padding: "0px 5px 0px 10px",
    display: "inline-block",
    width: "84px",
    overflow: "hidden"
	},
	projectLogo: {
		display: "inline-block",
		margin: "0px",
		height: "32px",
		width: "32px",
		border: "solid 0px rgb(188, 188, 188)"
	},
	projectName: {
		width: "90px",
		fontSize: "15px",
		textShadow: "0px 0px 1px rgb(0, 0, 0)",
		margin: "0px",
		padding: "0px",
		color: "#FFFFFF",
		fontWeight: "300",
		letterSpacing: "0.2px",
		fontFamily: "Roboto",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis"
	},
	projectTeam: {
		width: "90px",
		fontSize: "12px",
		textShadow: "0px 0px 1px rgba(0, 0, 0, 0.78)",
		letterSpacing: "0.3px",
		margin: "0px",
		padding: "0px",
		// color: "rgba(206, 187, 217, 0.95)",
		color: "rgba(223, 212, 241, 0.953)",
		// fontFamily: "Roboto",
		fontWeight: "400",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis"
	},
	navigation: {
		margin: 0,
		padding: 0,
		background: "transparent"
	},

	innerDiv: {
		marginLeft: "-5px",
    padding: "8px 0px 8px 0px",
    position: "relative",
		textShadow: "rgba(255, 255, 255, 0.509804) 0px 0px 1px",
		color: "rgb(113, 113, 113)",
		fontSize: "11px",
		fontWeight: 600,
		fontFamily: "Open Sans",
		letterSpacing: "0.5px",
		textTransform: "uppercase",
		border: 0
	},

	nestedItemInnerDivMulti: {
		margin: '0px 0px 0px 25px',
    padding: '0px !important',
		lineHeight: "21px",
		position: "relative",
		border: 0,
    textTransform: "capitalize",
		color: "rgba(78, 78, 78, 0.952941)",
    textShadow: "rgb(255, 255, 255) 0px 0px 1px",
    fontSize: "13.5px",
    fontWeight: 400,
    fontFamily: "Open Sans",
    letterSpacing: "0.2px"
	},

	nestedItemCheckboxMulti: {
		top: '-1px',
		left: '-28px',
		margin: 0,
		padding: 0,
		opacity: 1
	},

	nestedList: {
		background: "none",
		boxShadow: "none",
		borderRadius: "0px",
		padding: "0px 0px 0px 0px"
	},

	listItem: {
		borderRadius: "0px",
		padding: "0px",
		margin: "0px 0px -10px 5px",
		lineHeight: "32px",
		border: "solid 0px",
		borderBottom: "solid 1px rgba(218, 211, 228, 0)",
	},


	nestedListItem: {
		borderRadius: "0px",
		padding: "0px 0px 0px 0px",
		border: "solid 0px",
		borderBottom: "solid 1px rgba(218, 211, 228, 0)"
	},


  // Apparently, this is not supported anymore by Material UI.. Okay.
	selectedItem: {
		background: "rgba(170, 163, 206, 0.3)"
	},

	avatar: {
		top: "-3px",
		left: "-3px",
		backgroundColor: "rgba(0,0,0,0)"
	},
	icon: {
		height: "22px",
		width: "22px",
		color: "rgb(196, 185, 212)",
		fill: "rgb(201, 194, 212)",
		strokeWidth: "1px",
		stroke: "rgba(0, 0, 0, 0.3)"
	},
	subMenuIcon: {
		height: "20x",
		width: "20px",
		color: "rgb(121, 107, 142)",
		fill: "rgb(172, 168, 197)",
		strokeWidth: "0.5px",
		stroke: "rgba(255, 255, 255, 0.89)"
	}
};

export default styles;
