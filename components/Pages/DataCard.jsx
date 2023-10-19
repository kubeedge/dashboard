import { Button, Card, CardContent, CardHeader } from "@mui/material";

const DataCard = (props) => {
    return (
        <Card>
            <CardHeader title={props.title} action={props.action || []}>
            </CardHeader>
            <CardContent>
                { props.children }
            </CardContent>
        </Card>
    );
}

export default DataCard;