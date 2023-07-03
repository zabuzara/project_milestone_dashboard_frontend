type EditButtonProps = {
    src: string,
    class: string
}
/**
 * Edit Button Function-Component 
 * @param props
 */
export default function EditButtonComponent(props: EditButtonProps) {
    return (
        <img className={props.class} src={props.src} />
  );
}