type SaveButtonProps = {
    src: string,
    class: string
}
/**
 * Save Button Function-Component 
 * @param props
 */
export default function SaveButtonComponent(props: SaveButtonProps) {
    return (
        <img className={props.class} src={props.src} />
    );
}