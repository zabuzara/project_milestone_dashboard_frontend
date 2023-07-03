type CancelButtonProps = {
    src: string,
    class: string
}
/**
 * Cancel Button Function-Component 
 * @param props
 */
export default function CancelButtonComponent(props: CancelButtonProps) {
    return (
        <img className={props.class} src={props.src} />
    );
}