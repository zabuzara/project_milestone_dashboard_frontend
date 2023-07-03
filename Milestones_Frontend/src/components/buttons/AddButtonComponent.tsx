type AddButtonProps = {
    src: string,
    class: string
}
/**
 * Add Button Function-Component 
 * @param props
 */
export default function AddButtonComponent(props: AddButtonProps) {
    return (
        <img className={props.class} src={props.src} />
    );
}