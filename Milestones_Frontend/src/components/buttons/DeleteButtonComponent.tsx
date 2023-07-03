type DeleteButtonProps = {
    src: string,
    class: string
}
/**
 * Delete Button Function-Component 
 * @param props
 */
export default function DeleteButtonComponent(props: DeleteButtonProps) {
    return (
        <img className={props.class} src={props.src} />
    );
}